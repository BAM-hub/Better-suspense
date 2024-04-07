import { Fragment, useState } from "react";
import "./App.css";
import Suspenser from "./components/Suspenser";

function App() {
  const [data, setData] = useState({ name: null });
  return (
    <Suspenser
      setData={setData}
      fetch={new Promise<{ data: string }>((res, rej) => {
        // setTimeout(() => {
        //   res([
        //     {
        //       name: "data",
        //     },
        //     {
        //       name: "second",
        //     },
        //   ]);
        // }, 3000);
        rej("err");
      }).catch((err) => console.log(err))}
      renderErrorElement={() => <>somthing went wrong</>}
      renderElement={(data) => {
        return (
          <>
            {data.map((item, index) => (
              <Fragment key={index}>{item.name}</Fragment>
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
