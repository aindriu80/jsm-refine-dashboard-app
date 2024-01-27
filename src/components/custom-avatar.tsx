import { Avatar as AntdAvatar } from "antd";
import { AvatarProps } from "antd/lib";

type Props = AvatarProps & {
  name: string;
};

const CustomAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <AntdAvatar
      alt={"Aindriú Mac Giolla Eoin"}
      size="small"
      style={{
        background: "#87d068",
        display: "flex",
        alignItems: "center",
        border: "none",
      }}
    >
      {name}
    </AntdAvatar>
  );
};

export default CustomAvatar;
