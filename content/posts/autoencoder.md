---
title: "Autoencoder"
date: 2025-06-22
draft: false
tags: ["Autoencoder"]
math: true
---

### Background
An autoencoder is a type of unsupervised deep learning, where the neural network learns a latent representation of the data. There are two parts of the autoencoder: the encoder and decoder (see architecture below). The encoder maps the input data into a latent space. The decoder tries to recreate the input from the encoded representation. The target the autoencoder is trained on is the input.

<img src="/images/ae_architecture.png" alt="alt text" height="400">
<br>
<br>

### Reconstructions
We train an autoencoder on the MNIST data set, with the dimension of the latent space being 2 to allow us to visualize it. After training for five epochs, we see that the autoencoder is doing a decent job of reconstructing images from the validation set. It is able to recreate digits 1, 7, and 0. However, the autoencoder gets some digits confused; it transforms a 2 into a 3; a 4 into a 9, and a 5 into a 6.

<img src="/images/ae_reconstructions_epoch_05.png" alt="alt text" >
<br><br>

### Latent Space
When we look at the latent space, we see that the distribution is not Gaussian. So when we generate samples from the normal distribution, they may be in a region where the data distribution does not have support; it will be a part of the latent space which doesn't correspond to a trained on digit. 

We see that the digits 0, 1, 6, and 7 are well separated. Other digits are harder to distinguish; for example, digits 4 and 9 are overlapping in the latent space. And digits 2, 3, 5, and 8 are also very close to each other. 

<img src="/images/ae_latent_space_epoch_5.png" alt="alt text" height="400">
<br>

To see how the model interpolates between digits, we plot the generated digits over a grid covering the latent space. We see the gradual transformation between digits across the space. We also see that where there is no support, the generated image does not resemble a digit.

<img src="/images/ae_latent_grid_overlay.png" alt="alt text" height="400">
<br>

<script>
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>