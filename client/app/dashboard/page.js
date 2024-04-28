import { redirect } from "next/navigation";
import { auth } from "../action";
import Nav from "@/components/Nav";
import Head from "next/head";

const page = async () => {
  const result = await auth();
  console.log(result);
  if (!result.auth) {
    redirect("/auth/signin");
  }
  return (
    <div className="h-screen bg-white">
      <Nav user={result.user} />
      <div className="py-20">
        <stripe-pricing-table
          pricing-table-id="prctbl_1PA4SHIhMnYFGjnnSLhpcJ2K"
          client-reference-id="loggend-user-id"
          publishable-key="pk_test_51PA4HYIhMnYFGjnnpcOQvguMJFqjVndPesE6jFeIFidRhtMOiS7dSlyaLdEnLrzqAbuJSjompMZk1YGVqlIuxUio00mogzpoZT"
        ></stripe-pricing-table>
      </div>
    </div>
  );
};

export default page;
