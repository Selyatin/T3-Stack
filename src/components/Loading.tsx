import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent } from "react";

type Props = {
  size?: SizeProp;
};

const Loading: FunctionComponent<Props> = ({ size }) => (
  <FontAwesomeIcon
    className="m-auto"
    icon={faSpinner}
    spin={true}
    size={size ?? "3x"}
  />
);

export default Loading;
