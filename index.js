let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 3;
});

let rectangles = [
  {
    x: canvas.width / 2 - 25, // Initial x position
    y: canvas.height / 2 - 25, // Initial y position
    width: 100,
    height: 100,
    speed: 2,
    dx: 1,
    dy: 1,
    color: "rgb(255, 0, 255)",
    sound: createBeepSound(),
  },
];

let isAnimationPlaying = true;

ctx.fillStyle = "rgb(255, 0, 255)"; // Red color

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < rectangles.length; i++) {
    let rect = rectangles[i];

    // Draw the rectangle at the current position
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    // Move the rectangle
    rect.x += rect.speed * rect.dx; // Adjust the speed as needed
    rect.y += rect.speed * rect.dy;

    // Check if the rectangle has reached the right edge
    if (
      rect.x + rect.width >= canvas.width ||
      rect.x <= 0 ||
      rect.y + rect.height >= canvas.height ||
      rect.y <= 0
    ) {
      // Remove the current rectangle
      rectangles.splice(i, 1);

      // Divide the rectangle into two halves
      let rect1 = {
        x: canvas.width / 2 - 25,
        y: canvas.height / 2 - 25,
        width: rect.width * 0.7,
        height: rect.height * 0.7,
        speed: rect.speed,
        dx: Math.cos(Math.random() * 2 * Math.PI) * rect.speed,
        dy: Math.sin(Math.random() * 2 * Math.PI) * rect.speed,
        color: getRandomColor(),
        sound: createBeepSound(),
      };

      let rect2 = {
        x: canvas.width / 2 - 25,
        y: canvas.height / 2 - 25,
        width: rect.width * 0.7,
        height: rect.height * 0.7,
        speed: rect.speed,
        dx: Math.cos(Math.random() * 2 * Math.PI) * rect.speed,
        dy: Math.sin(Math.random() * 2 * Math.PI) * rect.speed,
        color: getRandomColor(),
        sound: createBeepSound(),
      };

      // Add the two new rectangles to the array
      rectangles.push(rect1, rect2);
    }
  }
  console.log(rectangles.length);
  // Request the next animation frame
  if (isAnimationPlaying) {
    requestAnimationFrame(animate);
  }
}

function getRandomColor() {
  // Generate a random color in hex format
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

// Check if AudioContext is available in the browser
if (
  typeof AudioContext !== "undefined" ||
  typeof webkitAudioContext !== "undefined"
) {
  // Create a single AudioContext
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
} else {
  console.log("Sorry, but the Web Audio API is not supported by your browser.");
}

function createBeepSound() {
  if (audioContext) {
    var oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // value in hertz

    var gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    // Increase frequency after each iteration for a thinner/sharper sound
    oscillator.frequency.linearRampToValueAtTime(
      880,
      audioContext.currentTime + 1
    );

    // Stop the oscillator after 1 second
    oscillator.stop(audioContext.currentTime + 0.6);
  }
}

// Start the animation
animate();

function playSound() {
  alert("press spacebar to play/pause animation");
  alert("Do you want to play sound? press any key");
  document.body.addEventListener("keydown", function (event) {
    if (event.key !== " ") {
      createBeepSound();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 32) {
    // Spacebar key
    isAnimationPlaying = !isAnimationPlaying; // Toggle animation state
    if (isAnimationPlaying) {
      animate(); // Resume animation
    }
  }
});
