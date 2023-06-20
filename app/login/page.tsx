import Wrapper from "@/components/common/wrapper";
import Login from "@/components/login/login";
import AuthProvider from "@/components/common/auth-provider";
import Navbar from "@/components/common/navbar";

export const metadata = {
  title: "kodekodean.id - Login",
  description: "Belajar pemrograman ala anak ITB",
};

export default async function LoginPage() {
  return (
    <>
      <Navbar />
      <Wrapper>
        <AuthProvider requireGuest={true} redirectTo={"/course"}>
          <Login />
        </AuthProvider>
      </Wrapper>
    </>
  );
}
