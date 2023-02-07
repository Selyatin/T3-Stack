type ComponentProps = {};

const PageContainer = (props: React.PropsWithChildren<ComponentProps>) => (
  <div className="relative h-screen w-full lg:p-6 text-neutral">
    <div className="container lg:rounded-box relative m-auto h-full overflow-auto border bg-base-100 p-6 shadow">
      {props.children}
    </div>
  </div>
);

export default PageContainer;
