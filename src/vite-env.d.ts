type Category = {
  name: string;
  totalAmount: number;
};

type Message = {
  text: string;
  type: 'system' | 'user';
};

type AuxReader<Type> = {
  [key in keyof Type as undefined extends Type[key] ? key : never]?: Type[key];
} & {
  [key in keyof Type as undefined extends Type[key] ? never : key]: Type[key];
};

type AuxSpread<Type> = { [key in keyof Type]: Type[key] };

type AuxExpand<Type> = Type extends Type
  ? { [key in keyof Type]: Type[key] }
  : never;

type Transaction = AuxExpand<
  AuxReader<typeof import('@/utils/constants').transactionExample>
>;

interface ImportMetaEnv {
  readonly VITE_API_SERVER_HOST: string
  readonly VITE_API_SERVER_PORT: string
  readonly VITE_POSTGRES_URL: string
  readonly VITE_OPENAI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
