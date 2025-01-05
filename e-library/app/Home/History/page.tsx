"use client";
import { app, db } from "@/app/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMatric } from "@/app/context/MatricContext";
import { getDocs, collection } from "firebase/firestore";
import Link from "next/link";
import Sidebar from "../Sidebar";
import SearchBar from "@/app/SearchBar";

interface book {
  id: number;
  title: string;
  author: string;
  description: string;
  image: string;
  link: string;
}

interface messages {
  email: string;
  id: string;
  matric: string;
  password: string;
  name: string;
}

type user = {
  matric: string;
  email: string;
  password: string;
  name: string;
};

async function fetchDataFromFirestore(): Promise<messages[]> {
  const query = await getDocs(collection(db, "credentials"));
  const data: messages[] = [];
  query.forEach((doc) => {
    const docData = doc.data();
    if (
      typeof docData.email === "string" &&
      typeof docData.matric === "string" &&
      typeof docData.password === "string"
    ) {
      data.push({
        id: doc.id,
        email: docData.email,
        matric: docData.matric,
        password: docData.password,
        name: docData.name,
      });
    } else {
      console.warn(`Invalid data format in document ID: ${doc.id}`, docData);
    }
  });
  // console.log(data);
  return data;
}

function page() {
  // const [checking, setChecking] = useState<boolean>(true);
  const [updatedFavoriteBooks, setUpdatedFavoriteBooks] = useState<book[]>([]);
  const [userData, setUserData] = useState<user[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [historyBookID, sethistoryBookID] = useState<number>();
  const { matricNumber, setMatricNumber } = useMatric();
  const [history, setHistory] = useState<book[]>([]);
  const router = useRouter();
  const auth = getAuth(app);
  const [checking, setChecking] = useState<boolean>(true);
  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setUserData(data);
    }

    fetchData();
  }, []);
  onAuthStateChanged(auth, (user: User | null) => {
    if (!user) {
      router.push("../");
    } else {
      if (userData) {
        for (let i: number = 0; i <= userData?.length; i++) {
          if (user.email === userData[i]?.email) {
            setMatricNumber(userData[i].matric);
          }
        }
        setChecking(false);
      }
    }
  });

  // !fetching the history
  useEffect(() => {
    const fetchLibrary = async () => {
      if (matricNumber) {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/history/${matricNumber}`
          );
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          const data: book[] = await res.json(); // Assuming the API returns an array of books
          console.log("Fetched library data:", data); // Debug log
          setHistory(data); // Ensure `setLibrary` expects this type
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch library data:", error);
        }
      } else {
        console.warn("matricNumber is not set");
      }
    };

    fetchLibrary();
  }, [matricNumber]);

  const skeleton: Array<number> = [1, 2, 3, 4, 5, 6];
  const skeletonPlaceholder = skeleton.map((number: number) => {
    return (
      <section key={number} className="flex w-[400px] gap-4 ">
        <section className="bg-gray-400 h-[150px] w-[] rounded-md">
          <section
            className="h-[150px] min-w-[120px] rounded-md"
            style={{
              //  background: `url(${book.image})`,
              backgroundSize: "cover",
            }}
          ></section>
        </section>
        <section className="flex flex-col justify-between py-4">
          <section className="flex flex-col gap-2">
            <p className="font-semibold bg-gray-400 w-[200px] h-[10px] text-[1.3em]"></p>
            <p className="w-[150px] h-[20px] "></p>
          </section>
          <section className="flex items-center gap-2 h-[10px] w-[10px] bg-gray-400"></section>
        </section>
      </section>
    );
  });

  const historyElement = history.map((book: book, index: number) => {
    return (
      <section
        key={index}
        className="flex w-[400px] bg-white p-2 rounded-xl gap-4 "
      >
        <section className="bg-gray-400 rounded-md">
          <section
            className="min-h-[180px] min-w-[120px] rounded-md"
            style={{
              backgroundImage: `url(${book.image})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></section>
        </section>
        <section className="flex flex-col justify-between">
          <section>
            <p className="font-semibold text-[1.3em]">{book.title}</p>
            <p>{book.description}</p>
          </section>
          <section>
            <Link
              href={
                "https://drive.google.com/file/d/1zZt3dvHwle9N5k67R0LWIftnGzm6zbeo/view?usp=sharing"
              }
            >
              <p className="cursor-pointer text-blue-500">Read here</p>
            </Link>
          </section>
        </section>
      </section>
    );
  });

  if (checking) {
    return (
      /* From Uiverse.io by vk-uiux */
      <section className="w-[100%] h-[80vh] flex items-center justify-center">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>
    );
  }
  return (
    <div>
      <section>
        <SearchBar />
      </section>
      <section className="flex flex-wrap gap-4 my-2">
        {loading ? skeletonPlaceholder : historyElement}
      </section>
    </div>
  );
}

export default page;
