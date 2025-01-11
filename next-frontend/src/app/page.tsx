// pages/index.tsx
import Link from "next/link";
import { CSSProperties } from "react";

const Home: React.FC = () => {
  return (
    <main>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Welcome to the Animal Identifier</h1>
          <p style={styles.paragraph}>
            Upload an image of an animal and our app will identify it for you!
          </p>
          <Link href="/upload">
            <button style={styles.button}>Upload Image</button>
          </Link>
        </header>
      </div>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    height: "100%",
    padding: "0",
    fontFamily: "Gill Sans, sans-serif",
    color: "white",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "60px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  paragraph: {
    fontSize: "24px",
    fontWeight: "400",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#719eff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

export default Home;
