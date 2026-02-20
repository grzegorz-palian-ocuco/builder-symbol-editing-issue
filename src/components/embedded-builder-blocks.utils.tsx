import type { BuilderElement, Input } from '@builder.io/sdk';
import { createContext, useContext, useMemo } from 'react';

export interface BuilderCustomComponentBaseProps {
  builderBlock?: BuilderElement;
  builderState?: BuilderState;
}

export interface BuilderState {
  content: unknown;
  context: unknown;
  rootState: unknown;
  state: unknown;
  updates: number;
}

export function useMemoSelf<T>(value: T) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: the `value` is missing from the dependency array on purpose - it is represented as JSON
  return useMemo(() => value, [JSON.stringify(value)]);
}


export interface EmbeddedBuilderBlocksContextProps
  extends BuilderCustomComponentBaseProps {
  builderContent?: Partial<Record<string, React.ReactNode>>;
  builderTextContent?: Partial<Record<string, string>>;
  builderContentOptions?: Record<string, BuilderContentOptions>;
  dataPathPrefix: string;
}

export interface BuilderContentOptions {
  containerStyle?: React.CSSProperties;
  removeDefaultContainerStyle?: boolean;
}

export const EmbeddedBuilderBlocksContext =
  createContext<EmbeddedBuilderBlocksContextProps>({
    dataPathPrefix: '',
  });

export const embeddedBuilderBlocksOptionsInputs: Input[] = [
  { name: 'containerStyle', type: 'map' },
  { name: 'removeDefaultContainerStyle', type: 'boolean' },
];

export interface EmbeddedBuilderBlocksHOCProps
  extends BuilderCustomComponentBaseProps {
  builderContent?: Partial<Record<string, React.ReactNode>>;
  builderTextContent?: Partial<Record<string, string>>;
  builderContentOptions?: Record<string, BuilderContentOptions>;

  dataPathPrefix?: string;
}

/**
 * Wrap your builder-exposed component with this HOC to allow usage of {@link EmbeddedBuilderBlocks} components inside.
 *
 * @see {@link getBuilderBlockInputsForDataPaths}
 * @see {@link EmbeddedBuilderBlocks} for full example
 */
export function withEmbeddedBuilderContent<PropsType extends object>(
  Component: React.FC<PropsType>,
): React.FC<PropsType & EmbeddedBuilderBlocksHOCProps> {
  const ComponentWithEmbeddedBuilderBlocks: React.FC<
    PropsType & EmbeddedBuilderBlocksHOCProps
  > = (props) => {
    const {
      builderContent,
      builderTextContent,
      builderContentOptions,
      builderBlock,
      builderState,
      dataPathPrefix = '',
    } = props;

    const outerContext = useContext(EmbeddedBuilderBlocksContext);

    const innerContextValueWithoutBuilderState = useMemoSelf({
      builderContent: builderContent ?? outerContext.builderContent,
      builderTextContent: builderTextContent ?? outerContext.builderTextContent,
      builderContentOptions:
        builderContentOptions ?? outerContext.builderContentOptions,
      builderBlock: builderBlock ?? outerContext.builderBlock,
      dataPathPrefix: dataPathPrefix ?? outerContext.dataPathPrefix,
    });

    // Builder state cannot be passed through useMemoSelf as jsonStringify causes an infinite loop.
    const innerContextValue = useMemo(
      () => ({
        ...innerContextValueWithoutBuilderState,
        builderState,
      }),
      [innerContextValueWithoutBuilderState, builderState],
    );

    const {
      builderContent: _bC,
      builderTextContent: _bTC,
      dataPathPrefix: _dPP,
      ...propsWithoutBuilderContent
    } = props;
    const innerJSX = (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(propsWithoutBuilderContent as PropsType)}
      />
    );

    // If there already exists a EmbeddedBuilderBlocksContext,
    // and it points to the same parent block,
    // don't create a new context instance.
    if (
      outerContext.builderBlock &&
      (builderBlock == null ||
        builderBlock?.id === outerContext.builderBlock.id) &&
      dataPathPrefix === outerContext.dataPathPrefix
    )
      return innerJSX;

    return (
      <EmbeddedBuilderBlocksContext.Provider value={innerContextValue}>
        {innerJSX}
      </EmbeddedBuilderBlocksContext.Provider>
    );
  };

  return ComponentWithEmbeddedBuilderBlocks;
}

/**
 * Use this utility to easily generate builder input definitions for {@link EmbeddedBuilderBlocks}.
 * @param dataPaths An array of strings, where each string corresponds to a dataPath used in {@link EmbeddedBuilderBlocks}.
 *
 * @see {@link EmbeddedBuilderBlocks} for full example
 */
export function getBuilderBlockInputsForDataPaths(
  dataPaths: string[],
): Input[] {
  return [
    {
      name: 'builderContent',
      type: 'object',
      hideFromUI: true,
      subFields: dataPaths.map((dataPath) => ({
        name: dataPath,
        type: 'uiBlocks',
        defaultValue: [
          {
            '@type': '@builder.io/sdk:Element',
            layerName: dataPath,
          },
        ],
      })),
      defaultValue: Object.fromEntries(
        dataPaths.map((dataPath) => [
          dataPath,
          [{ '@type': '@builder.io/sdk:Element', layerName: dataPath }],
        ]),
      ),
    },
    {
      name: 'builderContentOptions',
      type: 'object',
      advanced: true,
      subFields: dataPaths.map((dataPath) => ({
        name: dataPath,
        type: 'object',
        subFields: embeddedBuilderBlocksOptionsInputs,
      })),
      defaultValue: Object.fromEntries(
        dataPaths.map((dataPath) => [
          dataPath,
          {
            containerStyle: {
              display: 'contents',
            },
            removeDefaultContainerStyle: true,
          },
        ]),
      ),
    },
  ];
}

export interface BuilderTextInputDataPathDescriptor {
  dataPath: string;
  defaultValue?: string;
}

export function getBuilderTextInputsForDataPaths(
  dataPathDescriptors: (string | BuilderTextInputDataPathDescriptor)[],
) {
  const dataPathDescriptorsWithDefaultValues: BuilderTextInputDataPathDescriptor[] =
    dataPathDescriptors.map((dataPathDescriptor) => {
      if (typeof dataPathDescriptor === 'string')
        return { dataPath: dataPathDescriptor, defaultValue: '' };

      return {
        dataPath: dataPathDescriptor.dataPath,
        defaultValue: dataPathDescriptor.defaultValue ?? '',
      };
    });

  return {
    name: 'builderTextContent',
    type: 'object',
    subFields: dataPathDescriptorsWithDefaultValues.map(
      (dataPathDescriptor) => ({
        name: dataPathDescriptor.dataPath,
        type: 'text',
        defaultValue: dataPathDescriptor.defaultValue,
      }),
    ),
    defaultValue: Object.fromEntries(
      dataPathDescriptorsWithDefaultValues.map((dataPathDescriptor) => [
        dataPathDescriptor.dataPath,
        dataPathDescriptor.defaultValue,
      ]),
    ),
  };
}

export type BuilderTextDescriptors = Record<
  string,
  BuilderTextInputDataPathDescriptor | string
>;
export interface UseBuilderTextContentReturnValue<
  DescriptorsType extends BuilderTextDescriptors,
> {
  getTextFor(
    dataPathDescriptor: string | BuilderTextInputDataPathDescriptor,
  ): string;
  texts: Record<keyof DescriptorsType, string>;
}

/**
 * This hook can be used in combination with the {@link withEmbeddedBuilderContent} HOC to add builder-editable string labels easily.
 * It makes use of the same context based mechanism as {@link EmbeddedBuilderBlocks}.
 *
 * To work correctly this hook requires 3 things:
 * - the parent builder-exposed component needs to be wrapped with {@link withEmbeddedBuilderContent}
 * - the parent builder-exposed component needs to have inputs registered with {@link getBuilderTextInputsForDataPaths}.
 * - the inputs registered above need to have matching dataPaths to the dataPaths used in the component
 *
 * @param textDescriptors Optional but highly recommended object containing the keys that can be used within the component.
 *
 * The object can be used in {@link getBuilderTextInputsForDataPaths} as well, to ensure matching keys.
 *
 * @example
 * ```tsx
 * const exampleComponentTextDescriptors = {
 *   exampleComponentTitle: { dataPath: 'exampleComponent.title' },
 *   exampleComponentSubTitle: { dataPath: 'exampleComponent.subtitle' },
 * } satisfies BuilderTextDescriptors;
 * // 👆 the *satisfies* keyword ensures the object has the correct type without narrowing/expanding it.
 * // This means that the type information regarding the keys used in the object is retained, and can be used by intellisense.
 *
 * // example-component.builder.ts
 * Builder.registerComponent(ExampleComponent, {
 *   name: 'ExampleComponent',
 *   inputs: [
 *     ...getBuilderTextInputsForDataPaths(Object.values(exampleComponentTextDescriptors))
 *   ]
 * })
 *
 * // example-component.component.tsx
 * export const ExampleComponent = withEmbeddedBuilderContent(() => {
 *   const { texts } = useBuilderTextContent(exampleComponentTextDescriptors);
 *
 *   return (
 *     <div>
 *       <ImaginaryComponentWithStringProp stringProp={texts.exampleComponentTitle} />
 *       <h2>{texts.exampleComponentSubTitle}</h2>
 *     </div>
 *   );
 * });
 *
 * ```
 */
export function useBuilderTextContent<
  DescriptorsType extends BuilderTextDescriptors,
>(
  textDescriptors: DescriptorsType = {} as DescriptorsType,
): UseBuilderTextContentReturnValue<DescriptorsType> {
  const builderContentContext = useContext(EmbeddedBuilderBlocksContext);

  const getTextFor = (
    dataPathDescriptor: string | BuilderTextInputDataPathDescriptor,
  ) => {
    const dataPath =
      typeof dataPathDescriptor === 'string'
        ? dataPathDescriptor
        : dataPathDescriptor.dataPath;

    return (
      builderContentContext.builderTextContent?.[
        `${builderContentContext.dataPathPrefix}${dataPath}`
      ] ?? ''
    );
  };

  const texts = Object.fromEntries(
    Object.entries(textDescriptors).map(([key, value]) => [
      key,
      getTextFor(value),
    ]),
  ) as Record<keyof DescriptorsType, string>;

  return {
    getTextFor,
    texts,
  };
}
