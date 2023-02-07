import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSidePropsContext } from "next";
import { User, Company, Address } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import Loading from "../../components/Loading";
import PageContainer from "../../components/PageContainer";
import LabelWrapper from "../../components/LabelWrapper";
import axios from "axios";
import { isAuthenticated } from "../../server/sessions";

import { api } from "../../utils/api";
import { useEffect, useState } from "react";

type Props = { id: number | null };

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!(await isAuthenticated(ctx.req)))
    return { redirect: { destination: "/login", permanent: false } };

  return {
    props: { id: ctx.params?.id ? parseInt(ctx.params.id as string) : NaN },
  };
};

const UserPage = (props: Props) => {
  const [user, setUser] = useState<User>({
    id: -1,
    name: "",
    username: "",
    email: "",
    website: "",
    phone: "",
  });
  const [company, setCompany] = useState<Company>({
    id: -1,
    userId: -1,
    catchPhrase: "",
    name: "",
    bs: "",
  });
  const [address, setAddress] = useState<Address>({
    id: -1,
    userId: -1,
    lat: "",
    lng: "",
    street: "",
    suite: "",
    city: "",
    zipcode: "",
  });

  const [isPlaceholderLoading, setIsPlaceholderLoading] = useState(false);

  const userQuery = props.id
    ? api.user.findUser.useQuery(props.id, {
        refetchOnWindowFocus: false,
        retry: false,
      })
    : { error: undefined, isLoading: false, data: undefined };

  const userMutation = api.user.upsertUser.useMutation();

  const deleteUserMutation = api.user.deleteUser.useMutation();

  useEffect(() => {
    if (!userQuery.data) return;
    setUser(userQuery.data as User);
    setCompany(userQuery.data.company!);
    setAddress(userQuery.data.address!);
  }, [userQuery]);

  const handleUpsert = async () => {
    if (!user || !company || !address) return;
    try {
      await userMutation.mutateAsync({ user, company, address });
      Router.replace("/");
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      Router.replace("/");
    } catch (err) {
      alert(err);
    }
  };

  const handlePlaceholder = async () => {
    setIsPlaceholderLoading(true);
    try {
      const response = await axios.get(
        `//jsonplaceholder.typicode.com/users/${Math.floor(
          Math.random() * 10 + 1
        )}`
      );
      const { lat, lng } = structuredClone(response.data.address.geo);
      delete response.data.id;
      delete response.data.address.geo;

      response.data.address.lat = lat;
      response.data.address.lng = lng;

      setAddress({ ...address, ...response.data.address });
      setCompany({ ...company, ...response.data.company });

      delete response.data.address;
      delete response.data.company;
      response.data.website = `https://${response.data.website}`;
      setUser({ ...user, ...response.data });
    } catch (err: any) {
      alert(err.message);
    }
    setIsPlaceholderLoading(false);
  };

  const updateUser = () => setUser(structuredClone(user));
  const updateAddress = () => setAddress(structuredClone(address));
  const updateCompany = () => setCompany(structuredClone(company));

  if (userQuery.error?.data?.code === "NOT_FOUND") return Router.back();

  return (
    <>
      <Head>
        <title>User - {user.name ?? "New User"}</title>
      </Head>
      <PageContainer>
        <div className="breadcrumbs text-2xl font-bold">
          <ul>
            <li>
              <Link href="/">Users</Link>
            </li>
            <li>
              {props.id ? (
                <Link href={`/user/${props.id}`}>{user?.name}</Link>
              ) : (
                "New User"
              )}
            </li>
          </ul>
        </div>

        {userQuery.isLoading && !user ? (
          <div className="flex h-full">
            <Loading />
          </div>
        ) : (
          <>
            <div className="flex w-full flex-col justify-center gap-6 lg:flex-row">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">User</h2>
                <LabelWrapper label="Name">
                  <input
                    type="text"
                    placeholder="Name"
                    className="input-bordered input"
                    value={user.name}
                    onChange={(e) => {
                      user.name = e.target.value;
                      updateUser();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Username">
                  <input
                    type="text"
                    placeholder="Username"
                    className="input-bordered input"
                    value={user.username}
                    onChange={(e) => {
                      user.username = e.target.value;
                      updateUser();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="E-Mail">
                  <input
                    type="text"
                    placeholder="E-Mail"
                    className="input-bordered input"
                    value={user.email}
                    onChange={(e) => {
                      user.email = e.target.value;
                      updateUser();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Phone">
                  <input
                    type="text"
                    placeholder="Phone"
                    className="input-bordered input"
                    value={user.phone}
                    onChange={(e) => {
                      user.phone = e.target.value;
                      updateUser();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Website">
                  <input
                    type="text"
                    placeholder="Website"
                    className="input-bordered input"
                    value={user.website}
                    onChange={(e) => {
                      user.website = e.target.value;
                      updateUser();
                    }}
                  />
                </LabelWrapper>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Company</h2>
                <LabelWrapper label="Company Name">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="input-bordered input"
                    value={company.name}
                    onChange={(e) => {
                      company.name = e.target.value;
                      updateCompany();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Company Catch Phrase">
                  <input
                    type="text"
                    placeholder="Company Catch Phrase"
                    className="input-bordered input"
                    value={company.catchPhrase}
                    onChange={(e) => {
                      company.catchPhrase = e.target.value;
                      updateCompany();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Company BS">
                  <input
                    type="text"
                    placeholder="Company BS"
                    className="input-bordered input"
                    value={company.bs}
                    onChange={(e) => {
                      company.bs = e.target.value;
                      updateCompany();
                    }}
                  />
                </LabelWrapper>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Address</h2>
                <LabelWrapper label="City">
                  <input
                    type="text"
                    placeholder="City"
                    className="input-bordered input"
                    value={address.city}
                    onChange={(e) => {
                      address.city = e.target.value;
                      updateAddress();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Street">
                  <input
                    type="text"
                    placeholder="Street"
                    className="input-bordered input"
                    value={address.street}
                    onChange={(e) => {
                      address.street = e.target.value;
                      updateAddress();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Suite">
                  <input
                    type="text"
                    placeholder="Suite"
                    className="input-bordered input"
                    value={address.suite}
                    onChange={(e) => {
                      address.suite = e.target.value;
                      updateAddress();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Suite">
                  <input
                    type="text"
                    placeholder="Zipcode"
                    className="input-bordered input"
                    value={address.zipcode}
                    onChange={(e) => {
                      address.zipcode = e.target.value;
                      updateAddress();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Latitude">
                  <input
                    type="text"
                    placeholder="Latitude"
                    className="input-bordered input"
                    value={address.lat}
                    onChange={(e) => {
                      address.lat = e.target.value;
                      updateAddress();
                    }}
                  />
                </LabelWrapper>
                <LabelWrapper label="Longitude">
                  <input
                    type="text"
                    placeholder="Longitude"
                    className="input-bordered input"
                    value={address.lng}
                    onChange={(e) => {
                      address.lng = e.target.value;
                      updateAddress();
                    }}
                  />
                </LabelWrapper>
              </div>
            </div>
            <div className="my-2 flex justify-center gap-4">
              {props.id ? (
                <button
                  disabled={deleteUserMutation.isLoading}
                  className={`btn hover:btn-error ${
                    deleteUserMutation.isLoading ? "loading" : null
                  }`}
                  onClick={handleDelete}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              ) : null}
              <button
                onClick={handlePlaceholder}
                disabled={isPlaceholderLoading}
                className={`btn hover:btn-warning ${
                  isPlaceholderLoading ? "loading" : null
                }`}
              >
                FILL WITH PLACEHOLDER
              </button>
              <button
                onClick={handleUpsert}
                disabled={userMutation.isLoading}
                className={`btn hover:btn-success ${
                  userMutation.isLoading ? "loading" : null
                }`}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </>
        )}
      </PageContainer>
    </>
  );
};

export default UserPage;
