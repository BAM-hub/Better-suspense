import { Fragment } from "react";
import "./App.css";
import { createPromiseResolver } from "./components/Suspenser";

type Response = {
  name: string;
  email: string;
}[];

function App() {
  const Suspenser = createPromiseResolver<Response>([]);
  return (
    <Suspenser
      fetch={
        new Promise<Response>((res, rej) => {
          setTimeout(() => {
            res([
              {
                name: "data",
                email: "bam@shits.com",
              },
            ]);
          }, 3000);
          setTimeout(() => {
            rej("err");
          }, 3000);
        })
      }
      renderErrorElement={() => <>somthing went wrong</>}
      renderElement={(data) => {
        return (
          <>
            {data.map((item, index) => (
              <Fragment key={index}>
                {item.name} {item.email}
              </Fragment>
            ))}
          </>
        );
      }}
    >
      {/* {data?.name} */}
    </Suspenser>
  );
}
export default App;
