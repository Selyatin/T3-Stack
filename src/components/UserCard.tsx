import Link from "next/link";
import { FunctionComponent } from "react";
import { faUserAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  id: number,
  username: string,
  name: string,
  email: string,
  company: {
    name: string,
  } | null,
};

const UserCard: FunctionComponent<Props> = ({ id, username, name, email, company }) => {
  return (
    <div className="card w-80 border shadow transition hover:shadow-lg">
      <div className="card-body text-center">
        <FontAwesomeIcon icon={faUserAlt} className="m-auto" width={60} />
        <h3 className="m-auto text-xl">Username: {username}</h3>
        <h3 className="m-auto text-xl">Name: {name}</h3>
        <h3 className="m-auto text-xl">E-Mail: {email}</h3>
        <h3 className="m-auto text-xl">
          Company: {company ? company.name : "Unknown"}
        </h3>
        <Link href={`/user/${id}`} className="btn hover:btn-primary">
          Expand{" "}
          <FontAwesomeIcon className="ml-2" icon={faInfoCircle} width={16} />
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
