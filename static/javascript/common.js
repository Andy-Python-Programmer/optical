/// Simple calculations for the ease in out cubic animation.
function ease_in_out_cubic(time, start, change, duration) {
    time /= duration / 2;

    if (time < 1) return change / 2 * time * time * time + start;
    time -= 2;

    return change / 2 * (time * time * time + 2) + start;
}

/// Scroll to the top of the page.
function scroll_to_the_top() {
    const targetPosition = 0;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 750;
    let start = null;

    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(0, ease_in_out_cubic(progress, startPosition, distance, duration));
        if (progress < duration) window.requestAnimationFrame(step);
    }
}