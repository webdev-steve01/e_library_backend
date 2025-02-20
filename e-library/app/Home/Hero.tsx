"use client";
import Image from "next/image";
import BookOne from "@/public/BookOne.svg";
import stack from "@/public/stack.svg";
import addToLibrary from "@/public/Plus.svg";
import addToFavourites from "@/public/fav.svg";
import noImage from "@/public/no-image.jpg";
import seeMore from "@/public/right-arrow-backup-2-svgrepo-com.svg";
import Link from "next/link";
import done from "@/public/done-mini-1484-svgrepo-com.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useName } from "../context/NameContext";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { app, db } from "../firebase";
import { useMatric } from "../context/MatricContext";

interface book {
  id: number;
  title: string;
  author: string;
  description: string;
  image: string;
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

const auth = getAuth(app);

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
  console.log(data);
  return data;
}

function Hero() {
  const [resources, setResources] = useState<Array<book> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<Array<user>>([]);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [bookID, setBookID] = useState<number>();
  const [library, setLibrary] = useState<Array<number>>([]);
  const [oldlibrary, setOldLibrary] = useState<Array<book>>([]);
  const { matricNumber, setMatricNumber } = useMatric();
  const [test, setTest] = useState<boolean>(false);
  // alert(matricNumber);
  const router = useRouter();

  const { name, setUserName } = useName();
  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        "https://e-library-backend-ry8t.onrender.com/explore-resources"
      )
        .then((res) => res.json())
        .then((data: book[]) => {
          setResources(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleBorowedBooks = async (user_id: string, book_id: number) => {
      await fetch(
        `https://e-library-backend-ry8t.onrender.com/borrow-book/${user_id}/${book_id}`,
        { method: "POST" } // Ensure you're using the correct HTTP method
      )
        .then(() => {
          // alert("success in adding book, ");
          setLibrary((prevID) => [...prevID, book_id]);
          const newBook = resources?.find((book) => book.id === book_id);
          if (newBook) {
            setOldLibrary((prev) => [...prev, newBook]);
          }
          if (library) {
            console.log("");
          }
        })
        .catch((err) => {
          alert(err);
        });
    };
    if (bookID) {
      handleBorowedBooks(String(matricNumber), bookID);
    }
  }, [test, bookID, matricNumber, resources, library]);

  useEffect(() => {
    const checkLibrary = async () => {
      if (matricNumber) {
        try {
          const res = await fetch(
            `https://e-library-backend-ry8t.onrender.com/borrowed-books/${matricNumber}`
          );
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          const data: book[] = await res.json(); // Assuming the API returns an array of books
          setOldLibrary(data); // Ensure `setLibrary` expects this type

          console.log(bookID);
        } catch (error) {
          console.error("Failed to fetch library data:", error);
        }
      }
    };

    checkLibrary(); // Replace 123 with the actual `user_id`
  }, [matricNumber, test, bookID]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setUserData(data);
      // setName(data
    }

    fetchData();
  }, []);

  const isPreviouslyAdded = (book_id: number): boolean => {
    return oldlibrary?.some((book) => book.id === book_id);
  };

  const displayBooks = resources?.slice(0, 10);
  if (resources) {
    console.table(displayBooks);
  }

  const handleLibrary = (value: number) => {
    setBookID(value);
    if (test) {
      setTest(false);
    } else {
      setTest(true);
    }
  };

  const placeHolderArray = [1, 2, 3, 4, 5];
  const placeHolder = placeHolderArray.map((value: number) => {
    return (
      <section key={value} className="flex min-w-[400px] gap-4 min-h-[150px]">
        <section className="bg-gray-400 rounded-md">
          <section className="h-[150px] w-[120px] rounded-md"></section>
        </section>
        <section className="flex flex-col justify-between py-2">
          <section className="flex flex-col gap-2">
            <p className="font-semibold text-[1.3em] bg-gray-500 w-[150px] h-[10px] rounded-full "></p>
            <p className="bg-gray-500 w-[200px] h-[20px] rounded-full"></p>
          </section>
          <section className="bg-gray-500 w-[200px] h-[10px] rounded-full"></section>
        </section>
      </section>
    );
  });
  const displayBooksElement = displayBooks?.map((book: book, index: number) => {
    return (
      <section key={index} className="flex min-w-[400px] gap-4">
        <section
          className="card__skeleton rounded-md"
          style={{ background: `url(${noImage})`, backgroundSize: "cover" }}
        >
          <section
            className="h-[150px] min-w-[120px] rounded-md"
            style={{
              background: `url(${book.image})`,
              backgroundSize: "cover",
            }}
          ></section>
        </section>
        <section className="flex flex-col justify-between">
          <section>
            <p className="font-semibold text-[1.3em]">{book.title}</p>
            <p>{book.description}</p>
          </section>
          <section className="flex items-center gap-4">
            <section
              className="flex gap-2"
              onClick={() => handleLibrary(book.id)}
            >
              <Image
                src={isPreviouslyAdded(book.id) ? done : addToLibrary}
                width={30}
                height={30}
                alt="add to library"
              />
              <p className="font-semibold">Add to library</p>
            </section>
            <Image
              src={addToFavourites}
              width={30}
              height={30}
              alt="add to favorite"
            />
          </section>
        </section>
      </section>
    );
  });

  onAuthStateChanged(auth, (user: User | null) => {
    if (user && userData) {
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].email === user.email) {
          setUserName(userData[i].name);
          setMatricNumber(userData[i].matric);
          setCheckingAuth(false);
          break;
        }
      }
    } else {
      router.push("../");
    }
  });

  if (checkingAuth) {
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
    <div className="my-2 flex flex-col z-10 ">
      <section className="bg-white rounded-[32px] p-[2em]  flex justify-between border-[#EDEDED] border border-solid">
        <section className="flex flex-col justify-between">
          <section>
            <h1 className="font-bold">Hello, {name ? name : "Reader"}</h1>
            <p className="font-extrabold text-[3em] text-[#23022E] max-w-[550px] ">
              What Would You Like To Read Today?
            </p>
          </section>
          <section className="flex gap-6 py-9 z-10">
            <section className="border  relative min-w-[220px] px-4 hero-float bg-[#f0edf0] rounded-full">
              <p className="font-semibold text-[#23022E]">Continue Reading</p>
              <section className="absolute right-3 top-[-30px]">
                <Image
                  src={BookOne}
                  className="bookOne rounded-md"
                  alt=""
                  width={50}
                  height={50}
                />
              </section>
            </section>
            <section className=" relative min-w-[220px] px-4 hero-float rounded-full bg-[#f0edf0] ">
              <p className="font-semibold text-[#23022E]">Borrowed Books</p>
              <section className="absolute right-3 top-[-30px]">
                <Image
                  src={resources ? resources[1].image : BookOne}
                  className="rounded-md bookOne"
                  alt=""
                  width={50}
                  height={50}
                />
              </section>
            </section>
          </section>
        </section>
        <section>
          <Image src={stack} alt="" width={350} height={200} />
        </section>
      </section>
      <section>
        {loading ? (
          <section className="flex gap-4 overflow-auto max-w-[70vw] bg-white py-2 px-2 rounded-lg">
            {placeHolder}
          </section>
        ) : (
          <section>
            <section className="flex justify-between cursor-default">
              <p className="font-semibold text-[1.2em py-2">
                Suggestions for you
              </p>
              <section>
                <Link href="./Home/Resources" className="flex items-center">
                  <p className="text-[1.2em] font-semibold">see more</p>
                  <Image src={seeMore} alt="" width={20} height={20} />
                </Link>
              </section>
            </section>
            <section className="flex gap-4 overflow-auto max-w-[70vw] bg-white py-2 px-2 rounded-lg">
              {displayBooksElement}
            </section>
          </section>
        )}
      </section>
    </div>
  );
}

export default Hero;
