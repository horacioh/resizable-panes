import { useActor, useInterpret } from "@xstate/react";
import { MouseEvent } from "react";
import { assign, createMachine } from "xstate";
import "./panes.css";

export function Panes(props: any) {
  const service = useInterpret(resizablePanesMachine);

  let [state] = useActor(service);
  return (
    <div {...props}>
      <div
        className="panes"
        onMouseMove={service.send}
        onMouseUp={(event) => service.send(event)}
      >
        <div data-pane data-pane-index="1">
          <p>pane 1</p>
          <code>{JSON.stringify(state.context)}</code>
        </div>
        <span
          className="resizer"
          role="presentation"
          onMouseDown={(event) => service.send(event)}
          onDragStart={(event) => service.send(event)}
          onMouseOver={(event) => service.send(event)}
        />
        <div data-pane data-pane-index="2">
          pane 2
        </div>
      </div>
    </div>
  );
}

type ResizablePanesContext = {
  direction: "horizontal" | "vertical";
  pointx: number;
  pointy: number;
  dx: number;
  dy: number;
};

type ResizablePanesEvent =
  | MouseEvent<HTMLSpanElement>
  | MouseEvent<HTMLDivElement>;

let resizablePanesMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCc4EsBeBDARgGzAAIAHLAOzgDo0ICBiAWwHsBXWSJgdzMVGKdhoALmiY8kIAB6IAtACYA7ABZKSgBwBGAGxyAnLqUKAzFoVyANCACespVsq6jSwwt0KADBoMalAX1+WqILY+ESkFLCUEMhYUFBoZFCMrOzMAG5gvCD8giJiWdIIMhpy9rruTuWeRl4aljZFJXIOToZaStql7ob+geghBCTkVNGx8YnJbGAsxFk5wqLioIXyWmqUAKzOGgrGeloVSvWyGkZGLc7Guj41Chv+ASBkTBBwWUGYuIPhVDQEcwIFvkJCsjLp1uptBsjGpykZdm5jkUlOdSgpNGCtE4FF41L0QB8BmFhpFRnEElAAblFgUTkYNpQ1Gp0WoTO53Mo7kiZEZ3Bd1N0zKcPLotPjCV9iREosgmMRiJAqUCllJbHJzvC5Ho1FqtBtdOruRoSpQ0ZolNcfBiNOL+pKhhElXkVStLpRNdrdfrDdZZHJ3GVWso1DojKU8Q8gA */
  createMachine(
    {
      tsTypes: {} as import("./panes.typegen").Typegen0,
      schema: {
        context: {} as ResizablePanesContext,
        events: {} as ResizablePanesEvent,
      },
      context: {
        direction: "horizontal",
        pointx: 0,
        pointy: 0,
        dx: 0,
        dy: 0,
      },
      initial: "idle",
      states: {
        idle: {
          on: {
            mousedown: {
              actions: ["assignValuesToContext"],
              target: "dragging",
            },
          },
        },
        dragging: {
          on: {
            mousemove: {
              actions: ["assignValuesToContext"],
            },
            mouseup: {
              actions: ["assignValuesToContext"],
              target: "idle",
            },
          },
        },
        dropped: {},
      },
      id: "resizable panes",
    },
    {
      actions: {
        assignValuesToContext: assign(
          (
            _,
            event: MouseEvent<HTMLDivElement> | MouseEvent<HTMLSpanElement>
          ) => ({
            pointx: event.clientX,
            pointy: event.clientY,
          })
        ),
      },
    }
  );
