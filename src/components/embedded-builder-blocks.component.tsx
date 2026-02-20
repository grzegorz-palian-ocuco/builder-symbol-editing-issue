import { BuilderBlocks, StateProvider } from '@builder.io/react';
import type React from 'react';
import { useContext, useMemo } from 'react';
import { EmbeddedBuilderBlocksContext } from 'src/components/embedded-builder-blocks.utils';


export interface EmbeddedBuilderBlocksProps {
  builderDataPath: string;
  style?: React.CSSProperties;

  /**
   * Passed as state to the contained builder blocks.
   */
  builderState?: object;
  /**
   * Passed as context to the contained builder blocks.
   */
  builderContext?: object;
}

/**
 * Combined with {@link withEmbeddedBuilderContent} HOC, and {@link getBuilderBlockInputsForDataPaths} utility function,
 * this component is a simple way to expose an editable section to builder.io
 *
 * To use this component there are a few requirements:
 * - you need a dataPath (which is essentially a prop name) that is unique in the scope of a single builder block parent
 *   - note, this doesn't mean globally unique, just unique within the parent. Duplicate names will just map to the same content (which may be intentional).
 * - your nearest parent builder-exposed component needs to be wrapped with {@link withEmbeddedBuilderContent}
 * - your nearest parent builder-exposed component needs to have an input registered with {@link getBuilderBlockInputsForDataPaths}
 *
 * @example
 * const ChildComponent = () => (
 *   <div>
 *     Integrate the EmbeddedBuilderBlocks anywhere in your component
 *     <EmbeddedBuilderBlocks builderDataPath="demoContent" />
 *     Pass a name to the `builderDataPath` prop that will identify this content block
 *   </div>
 * );
 *
 * // Wrap your parent component with `withEmbeddedBuilderContent`
 * const ParentComponent = withEmbeddedBuilderContent(() => (
 *   <div>
 *     Use your child component as normal
 *     <ChildComponent />
 *   </div>
 * ));
 *
 * // Use `getBuilderBlockInputsForDataPaths` in the inputs for the parent, along with any other inputs
 * // Use the name passed earlier to the builderDataPath prop.
 * Builder.registerComponent(ParentComponent, {
 *   name: 'ParentComponent',
 *   inputs: [...getBuilderBlockInputsForDataPaths(['demoContent'])],
 * });
 */
export const EmbeddedBuilderBlocks: React.FC<EmbeddedBuilderBlocksProps> = ({
  builderDataPath,
  style,
  builderState,
  builderContext,
}) => {
  const builderContentContext = useContext(EmbeddedBuilderBlocksContext);


  const blocks =
    builderContentContext.builderContent?.[
      `${builderContentContext.dataPathPrefix}${builderDataPath}`
    ];
  const options =
    builderContentContext.builderContentOptions?.[
      `${builderContentContext.dataPathPrefix}${builderDataPath}`
    ];

  if (!blocks) return null;

  let elements = (
    <BuilderBlocks
      style={{
        ...style,
        ...options?.containerStyle,
      }}
      dataPath={`component.options.builderContent.${builderContentContext.dataPathPrefix}${builderDataPath}`}
      parentElementId={builderContentContext.builderBlock?.id}
      blocks={blocks}
    />
  );

  if (builderState || builderContext)
    elements = (
      <StateProvider state={builderState} context={builderContext}>
        {elements}
      </StateProvider>
    );

  return elements;
};
