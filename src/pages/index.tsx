import Todo from "@/Components/Todo";
import Head from "next/head";


export default function Home() {
  return (
   <>
    <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>
   <Todo/>
   </>
  )
}
