import { FunctionComponent } from "react";

type Props = {
  label: string;
  children: JSX.Element;
};

const LabelWrapper: FunctionComponent<Props> = ({ label, children }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    {children}
  </div>
);

export default LabelWrapper;
