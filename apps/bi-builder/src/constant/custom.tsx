const CustomNode1 = ({ text }: { text: string }) => {
  return <div>{text}</div>;
};

export const customOptions: Record<
  string,
  { node: (...args: any[]) => JSX.Element; props: Record<string, any> }
> = {
  custom1: {
    node: CustomNode1,
    props: {
      text: 'custom1 text',
    },
  },
};
