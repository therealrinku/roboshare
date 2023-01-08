
export default function Loader({ progress }: any) {
  return (
    <>
      <div >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p style={{ color: "white   " }}>Uploading...{progress + "%"}</p>
    </>
  );
}
