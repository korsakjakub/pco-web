import { useSpring, animated } from 'react-spring';

const AnimateChips = (from: number, to: number) => {
  const { number } = useSpring({
    from: { number: from },
    number: to,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.div>{number.to((n: number) => "$" + n.toFixed(0))}</animated.div>
}

export default AnimateChips
