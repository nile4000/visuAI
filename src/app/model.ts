import * as tf from '@tensorflow/tfjs';

export function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [100, 100, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
  }));

  model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({units: 128, activation: 'relu'}));

  model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

  return model;
}

export function compileModel(model: { compile: (arg0: { optimizer: string; loss: string; metrics: string[]; }) => void; }) {
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
}

export async function trainModel(model: { fit: (arg0: any, arg1: any, arg2: { epochs: number; validationSplit: number; }) => any; }, xs: any, ys: any) {
  const history = await model.fit(xs, ys, {
    epochs: 10,
    validationSplit: 0.2,
  });

  return history;
}

export function predict(model: { predict: (arg0: any) => any; }, inputData: any) {
  const prediction = model.predict(inputData);
  return prediction;
}




