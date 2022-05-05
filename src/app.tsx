import "./app.css";
import { Panes } from "./panes";
import { Topbar } from "./topbar";

export function App() {
  return (
    <div className="page">
      <Topbar data-page-child="topbar" />
      <Panes data-page-child="content" />
    </div>
  );
}
