"use client";
import Image from "next/image";
import image from "@/public/bro.svg";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import LogInForm from "./LogInForm";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "./firebase";
import { useRouter } from "next/navigation";

function SignUp() {
  const [prevUser, setPrevUser] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const router = useRouter();
  const auth = getAuth(app);
  const handlePrevUser = () => {
    if (prevUser) {
      setPrevUser(false);
    } else {
      setPrevUser(true);
    }
  };

  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      router.push("./Home");
      // setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  });

  if (checkingAuth) {
    return (
      /* From Uiverse.io by vk-uiux */
      <section className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>
    );
  } else {
    return (
      <>
        <section className="flex justify-between px-[2.5em] py-[2em]">
          <section>
            {prevUser ? (
              <section>
                <h1 className="text-[1.5em]  font-bold">Welcome Back!</h1>
                <p className="font-bold">
                  Enter your credentials to access your account
                </p>
              </section>
            ) : (
              <h1 className="text-[1.5em]  font-bold">Get Started Now</h1>
            )}
            {prevUser ? <LogInForm /> : <SignUpForm />}
            <section className="text-center">
              <p>
                {prevUser ? " Don't have an account?" : "Have an account?"}{" "}
                <span
                  onClick={handlePrevUser}
                  className="cursor-default text-[#0F3DDE]"
                >
                  {prevUser ? "sign up" : "sign in"}
                </span>
              </p>
            </section>
          </section>
          <section>
            <Image
              src={image}
              height={400}
              width={600}
              alt="sign up or log in"
            />
          </section>
        </section>
      </>
    );
  }
}

export default SignUp;
