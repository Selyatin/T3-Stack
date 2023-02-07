type ComponentProps = {};

const PageContainer = (props: React.PropsWithChildren<ComponentProps>) => (
  <div className="relative h-screen w-full text-neutral lg:p-6">
    <div className="container relative m-auto h-full overflow-auto border bg-base-100 p-6 shadow lg:rounded-box">
      {props.children}
    </div>
  </div>
);

export default PageContainer;
