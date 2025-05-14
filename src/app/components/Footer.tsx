export default function Footer() {
  return (
    <footer
      className="w-full text-center py-4 fixed bottom-0 left-0 z-50"
      style={{ backgroundColor: "#4e4c4f" }}
    >
      <p className="text-[#ffddba] text-sm">
        © {new Date().getFullYear()} Dawson Eakins. All rights reserved.
      </p>
    </footer>
  );
}
