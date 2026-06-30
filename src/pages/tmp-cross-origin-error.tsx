import { BuilderComponent } from "@builder.io/react";
import { useEffect, useRef, useState } from "react";

/**
 * Faithful reproduction of the production crash:
 *
 *   SecurityError: Blocked a frame with origin "..." from accessing a cross-origin frame.
 *     at isLocalizedField (extract-localized-values)
 *     at traverse
 *
 * RUN A PRODUCTION BUILD: `npm run build && npm start`, then open this page.
 * In `next dev` the SecurityError is MASKED by an unrelated TypeError: React DEV
 * freezes element props, and @builder.io/react recursively Proxy-wraps the traversed
 * state, so its get-trap returns a wrapped child that differs from a frozen (non-config,
 * non-writable) prop value -> V8 throws `'get' on proxy: property 'style'...` before the
 * walk reaches the cross-origin Window. Production React does not freeze props, so the
 * walk continues all the way to the Window and throws the real SecurityError.
 *
 * The ONLY thing leaked into Builder is an INNOCENT, same-origin DOM node (a plain
 * <div>). No window/iframe ref is ever bound. The crash happens because
 * @builder.io/react's `traverse` walks OWN-ENUMERABLE properties of every value it
 * finds, and a live DOM node exposes the whole React/DOM internals graph:
 *
 *   _ = { ...v.options, ...v.component.options }        // builder-react block render
 *   containsLocalizedValues(_) -> traverse(_) -> isLocalizedField(value)["@type"]
 *
 *   div  (bound into builder state via a binding)
 *    -> div.__reactFiber$…        own-enumerable expando React puts on host nodes
 *    -> fiber graph (return / child / sibling / memoizedState …)
 *    -> a hook that keeps `document` in its deps array   (here: useEffect(…, [document]);
 *       in prod it was react-idle-timer's useIdleTimer, whose default activity target is document)
 *    -> document
 *    -> document.__crossOriginExpando   own-enumerable expando whose value is a cross-origin Window
 *       (in prod: Stripe's document.__privateStripeMetricsController<id>)
 *    -> isLocalizedField(window) reads window["@type"] -> SecurityError
 *
 * Two background conditions reproduce what Stripe + react-idle-timer set up in prod:
 *   (A) some mounted hook holds `document` as an own-enumerable dep  -> useEffect(…, [document])
 *   (B) an own-enumerable expando on `document` points at a cross-origin Window
 * Neither is bound into Builder. Builder only ever sees the innocent <div>.
 */

const content = {
  data: {
    blocks: [
      {
        "@type": "@builder.io/sdk:Element",
        id: "builder-crash-block",
        component: {
          name: "Text",
          options: { text: "If you can read this without an error, the bug did not trigger." },
        },
        // Innocent: binds a plain DOM node (state.node) into the block options.
        // That single live node is enough for traverse to reach everything else.
        bindings: {
          "component.options.node": "state.node",
        },
      },
    ],
  },
};

const Page = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  // (A) Keep `document` in a hook's deps array so it's reachable from the fiber
  //     graph — mirrors react-idle-timer's useIdleTimer (default target = document).
  useEffect(() => {}, [typeof document !== "undefined" ? document : null]);

  useEffect(() => {
    // (B) Own-enumerable expando on document -> cross-origin Window (data: URI = opaque origin).
    //     Mirrors Stripe's document.__privateStripeMetricsController<id>.
    (document as unknown as Record<string, unknown>).__crossOriginExpando =
      iframeRef.current?.contentWindow;

    // Hand Builder the innocent <div>. nodeRef.current exists post-mount.
    setNode(nodeRef.current);
  }, []);

  return (
    <>
      {/* data: URI => opaque origin => contentWindow is cross-origin. Never bound into Builder. */}
      <iframe
        ref={iframeRef}
        title="cross-origin"
        src="data:text/html,<title>x</title>"
        style={{ display: "none" }}
      />
      {/* The innocent, same-origin node that gets bound into Builder state. */}
      <div ref={nodeRef} style={{ display: "none" }} />
      {node ? (
        <BuilderComponent model="page" content={content as any} data={{ node }} />
      ) : (
        <div>Setting up…</div>
      )}
    </>
  );
};

export default Page;
