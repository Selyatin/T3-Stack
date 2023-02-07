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
import Pagination from "../components/Pagination";
import { useRouter } from "next/router";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  if (!(await isAuthenticated(ctx.req)))
    return { redirect: { destination: "/login", permanent: false } };

  return { props: {} };
};

const Home: NextPage = () => {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const page = parseInt(router.query.page as string) - 1 || 0;
  const users = api.user.paginatedFind.useQuery({ page, searchString, limit: 5 });

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
          <div className="flex gap-2">
            <input type="text" placeholder="Search" className="input input-bordered" onChange={(e) => setSearchString(e.target.value)} />
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
          <>
          <div className="align-center flex flex-wrap justify-center gap-4">
            {users.data?.totalPages ? (
              users.data.users.map((user, i) => <UserCard key={i} {...user} />)
            ) : (
              <h2 className="text-2xl">Couldn't find any Users.</h2>
            )}
          </div>

          {users.data?.totalPages ? <Pagination totalPages={Math.round(users.data.totalPages)}/> : null}
          </>
        )}

        <div className="form-control"></div>
        
      </PageContainer>
    </>
  );
};

export default Home;
