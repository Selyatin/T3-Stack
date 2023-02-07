import {
  type NextPage,
  type GetServerSidePropsContext,
  type GetServerSideProps,
} from "next";
import Head from "next/head";
import Link from "next/link";
import PageContainer from "../components/PageContainer";
import Loading from "../components/Loading";
import UserCard from "../components/UserCard";

import { isAuthenticated } from "../server/sessions";
import { api } from "../utils/api";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  if (!(await isAuthenticated(ctx.req)))
    return { redirect: { destination: "/login", permanent: false } };

  return { props: {} };
};

const Home: NextPage = () => {
  const users = api.user.paginatedFind.useQuery({ page: 0, limit: 10 });

  return (
    <>
      <Head>
        <title>Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContainer>
        <div className="mb-2 flex w-full justify-between">
          <div className="breadcrumbs text-2xl font-bold">
            <ul>
              <li>
                <Link href="/">Users</Link>
              </li>
            </ul>
          </div>
          <div className="flex">
            <Link href="/user/add" className="btn-success btn">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </div>
        </div>
        {users.isLoading ? (
          <div className="flex h-full">
            <Loading />
          </div>
        ) : (
          <div className="align-center flex justify-center gap-4">
            {users.data?.totalPages ? (
              users.data.users.map((user, i) => <UserCard key={i} {...user} />)
            ) : (
              <h2 className="text-2xl">Couldn't find any Users.</h2>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default Home;
