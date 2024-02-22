const AnimateStake = (start: number, end: number, now: number) => {
	return start + (end - start) * now;
}

export default AnimateStake
