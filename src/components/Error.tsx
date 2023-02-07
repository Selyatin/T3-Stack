import { FunctionComponent } from "react";

type Props = {
  message: string;
};

const Error: FunctionComponent<Props> = ({ message }) => (
  <div className="rounded-box m-auto mb-4 w-96 bg-error p-6">
    <h2 className="text-xl font-bold">{message}</h2>
  </div>
);

export default Error;
