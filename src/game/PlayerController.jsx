import { useEffect, useRef } from "react";

export default function PlayerController({
  onMove,
  onLook,
  enabled = true
}) {
  const keys = useRef({});
  const joystick = useRef({
    active: false,
    x: 0,
    y: 0
  });

  const touchLook = useRef({
    active: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (!enabled) return;

    const down = (event) => {
      keys.current[event.key.toLowerCase()] = true;
    };

    const up = (event) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    let animation;

    const loop = () => {
      let x = 0;
      let z = 0;

      if (keys.current["w"] || keys.current["arrowup"]) {
        z -= 1;
      }

      if (keys.current["s"] || keys.current["arrowdown"]) {
        z += 1;
      }

      if (keys.current["a"] || keys.current["arrowleft"]) {
        x -= 1;
      }

      if (keys.current["d"] || keys.current["arrowright"]) {
        x += 1;
      }

      x += joystick.current.x;
      z += joystick.current.y;

      const length = Math.sqrt(x * x + z * z);

      if (length > 1) {
        x /= length;
        z /= length;
      }

      if (x !== 0 || z !== 0) {
        onMove?.({
          x,
          z
        });
      }

      animation = requestAnimationFrame(loop);
    };

    animation = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(animation);
    };
  }, [enabled, onMove]);

  const startJoystick = (event) => {
    event.preventDefault();

    joystick.current.active = true;
    updateJoystick(event);
  };

  const updateJoystick = (event) => {
    if (!joystick.current.active) return;

    const touch =
      event.touches?.[0] ||
      event.changedTouches?.[0];

    if (!touch) return;

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;

    const radius = rect.width / 2;

    dx = Math.max(-radius, Math.min(radius, dx));
    dy = Math.max(-radius, Math.min(radius, dy));

    joystick.current.x = dx / radius;
    joystick.current.y = dy / radius;
  };

  const stopJoystick = () => {
    joystick.current.active = false;
    joystick.current.x = 0;
    joystick.current.y = 0;
  };

  const startLook = (event) => {
    const touch = event.touches[0];

    touchLook.current = {
      active: true,
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const moveLook = (event) => {
    if (!touchLook.current.active) return;

    const touch = event.touches[0];

    const dx = touch.clientX - touchLook.current.x;
    const dy = touch.clientY - touchLook.current.y;

    touchLook.current.x = touch.clientX;
    touchLook.current.y = touch.clientY;

    onLook?.({
      x: dx,
      y: dy
    });
  };

  const stopLook = () => {
    touchLook.current.active = false;
  };

  if (!enabled) return null;

  return (
    <>
      <div
        className="mobile-look-area"
        onTouchStart={startLook}
        onTouchMove={moveLook}
        onTouchEnd={stopLook}
      />

      <div
        className="joystick"
        onTouchStart={startJoystick}
        onTouchMove={updateJoystick}
        onTouchEnd={stopJoystick}
        onTouchCancel={stopJoystick}
      >
        <div className="joystick-stick" />
      </div>
    </>
  );
}
