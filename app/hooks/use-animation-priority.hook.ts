import { useEffect, useReducer } from "react";

type AnimationPriority = "high" | "medium" | "low";

interface AnimationPriorityConfig {
  priority: AnimationPriority;
  isVisible: boolean;
}

type Action = { type: "ANIMATE" } | { type: "STOP" };

function shouldAnimateReducer(state: boolean, action: Action): boolean {
  switch (action.type) {
    case "ANIMATE":
      return true;
    case "STOP":
      return false;
  }
}

export function useAnimationPriority({ priority, isVisible }: AnimationPriorityConfig): boolean {
  const [shouldAnimate, dispatch] = useReducer(shouldAnimateReducer, false);

  useEffect(() => {
    if (priority === "high") {
      dispatch({ type: "ANIMATE" });
    } else if (priority === "medium") {
      dispatch(isVisible ? { type: "ANIMATE" } : { type: "STOP" });
    } else if (priority === "low") {
      if (!isVisible) {
        dispatch({ type: "STOP" });
      } else if ("requestIdleCallback" in window) {
        const id = requestIdleCallback(
          () => dispatch({ type: "ANIMATE" }),
          { timeout: 1000 },
        );
        return () => {
          cancelIdleCallback(id);
          dispatch({ type: "STOP" });
        };
      } else {
        dispatch({ type: "ANIMATE" });
      }
    }
  }, [priority, isVisible]);

  return shouldAnimate;
}
