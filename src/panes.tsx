import { useActor, useInterpret } from "@xstate/react";
import { MouseEvent, useRef } from "react";
import { assign, createMachine } from "xstate";
import "./panes.css";

export function Panes(props: any) {
  let leftPaneRef = useRef<HTMLDivElement>(null);
  const service = useInterpret(() => resizablePanesMachine).onTransition(
    (state) => {
      if (state.changed) {
        if (leftPaneRef.current) {
          leftPaneRef.current.style.setProperty(
            "--size",
            `${state.context.pointerx}px`
          );
        }
      }
    }
  );

  let [state] = useActor(service);
  return (
    <div className="panes-wrapper" {...props}>
      <div
        className="panes"
        onMouseMove={service.send}
        onMouseUp={(event) => service.send(event)}
      >
        <div data-pane data-pane-index="1" ref={leftPaneRef}>
          <code style={{ userSelect: "none", wordWrap: "break-word" }}>
            {JSON.stringify(state.context)}
          </code>
        </div>
        <span
          className="resizer"
          role="presentation"
          onMouseDown={(event) => service.send(event)}
          onDragStart={(event) => service.send(event)}
          onMouseOver={(event) => service.send(event)}
        />
        <div data-pane data-pane-index="2">
          <p>
            Quality. Is. paramount. When you deliver an application to your
            users, it needs to perform at a high standard. They expect to get
            their job done and using your service or site is part of that
            process. A great way to ensure your users can perform the vital
            process your service provides is end-to-end (E2E) testing. E2E
            Testing saves you time and headaches (especially for those of us on
            call) as it ensures every vital workflow your users perform are
            bug-free in each and every commit you make. Whether it’s Friday or
            earlier in the week, you can be confident your app is performing as
            it should. There are a lot of tools out there to help you write and
            run your tests, for E2E tests, Playwright from Microsoft is a great
            option. Basarat demonstrates how to get started with Microsoft
            Playwright. There’s no fussing with configuring files to work with
            Playwright. Adding Playwright is as easy as installing it when using
            create react app. It comes pre-configured out of the box with
            example tests to follow. You'll follow this up with various features
            of Playwright that make it extremely easy for you to test and
            automate modern web applications. Microsoft has even created a VS
            Code extension to allow you to run tests directly in your code
            editor with just the click of a button. It can time, re-run, and
            even bulk run all of your tests. You can add breakpoints to pause
            your tests at a certain point for better debugging. Playwright Test
            for VSCode helps to create a much smoother workflow, especially when
            you want to just focus on the code. Another amazing feature of
            Playwright is the visual regression testing. A common requirement in
            web application testing is to make sure that your web application
            looks exactly as you expect. When running a test with
            page.screenshot, it takes a picture and compares it to previous
            screenshots to make sure that your application looks the same.
            Basarat has released this course to give you a full tour of
            Playwright so you can start shipping code with confidence as soon as
            possible.
          </p>
        </div>
      </div>
    </div>
  );
}

type ResizablePanesContext = {
  direction: "horizontal" | "vertical";
  pointerx: number;
  pointery: number;
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
        pointerx: 0,
        pointery: 0,
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
            context,
            event: MouseEvent<HTMLDivElement> | MouseEvent<HTMLSpanElement>
          ) => ({
            pointerx: event.clientX,
            pointery: event.clientY,
            dx: event.clientX - context.pointerx,
            dy: event.clientY - context.pointery,
          })
        ),
      },
    }
  );
