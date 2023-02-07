import { useState, type FormEvent } from "react";
import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";

import Router from "next/router";
import { api } from "../utils/api";
import { isAuthenticated } from "../server/sessions";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (await isAuthenticated(ctx.req))
    return { redirect: { destination: "/", permanent: false } };

  return { props: {} };
};

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const mutation = api.admin.login.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username && password) {
      await mutation.mutateAsync({ username, password });
      Router.replace("/");
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="align-center container flex m-auto h-screen justify-center">
        <form
          className="card m-auto w-96 bg-base-100 text-neutral shadow"
          onSubmit={handleSubmit}
        >
          <div className="card-body gap-4">
            <div className="card-title text-2xl">
              <h1>Login</h1>
            </div>
            <input
              type="text"
              placeholder="Username"
              className="input-bordered input-primary input"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-bordered input-primary input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              disabled={mutation.isLoading}
              className={`btn-primary btn ${
                mutation.isLoading ? "loading" : ""
              }`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
