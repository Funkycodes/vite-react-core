import { Outlet } from "react-router-dom";

export default function Root({ ...props }) {
  return (
    <main {...props}>
      <Outlet />
    </main>
  );
}