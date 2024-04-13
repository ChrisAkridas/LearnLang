import { cva, type VariantProps } from "cva";

const styles = cva({
  base: "",
  variants: {
    intent: {
      primary: "",
      secondary: "",
    },
  },
});
interface Props extends VariantProps<typeof styles> {
  name: string;
}
const MyComp: FCC<Props> = ({ children, name, intent }) => {
  return <div className="">hello</div>;
};
