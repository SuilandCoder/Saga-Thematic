import { Injectable } from '@angular/core'

//最终没用上
@Injectable()
export class ImageProcessing {


    public kernels = {
        none: {
            data: [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0
            ]
        },
        sharpen: {
            data: [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ]
        },
        sharpenless: {
            data: [
                0, -1, 0,
                -1, 10, -1,
                0, -1, 0
            ]
        },
        blur: {
            data: [
                1, 1, 1,
                1, 1, 1,
                1, 1, 1
            ]
        },
        shadow: {
            data: [
                1, 2, 1,
                0, 1, 0,
                -1, -2, -1
            ]
        },
        emboss: {
            data: [
                -2, 1, 0,
                -1, 1, 1,
                0, 1, 2
            ]
        },
        edge: {
            data: [
                0, 1, 0,
                1, -4, 1,
                0, 1, 0
            ]
        }
    };

    //对内核进行规范化处理
    normalize(kernel) {
        var len = kernel.data.length;
        var normal = {
            data: new Array(len),
            normalized: false
        }
        var i, sum = 0;
        for (i = 0; i < len; ++i) {
            sum += kernel.data[i];
        }
        if (sum <= 0) {
            normal.normalized = false;
            sum = 1;
        } else {
            normal.normalized = true;
        }
        for (i = 0; i < len; ++i) {
            normal.data[i] = kernel.data[i] / sum;
        }
        return normal;
    }

    convolve(context, kernel) {
        var normalizedKernel = this.normalize(kernel);
        var canvas = context.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var size = Math.sqrt(normalizedKernel.data.length);
        var half = Math.floor(size / 2);

        var inputData = context.getImageData(0, 0, width, height).data;
        var output = context.createImageData(width, height);
        var outputData = output.data;

        for (var pixelY = 0; pixelY < height; ++pixelY) {
            var pixelsAbove = pixelY * width;
            for (var pixelX = 0; pixelX < width; ++pixelX) {
                var r = 0, g = 0, b = 0, a = 0;
                for (var kernelY = 0; kernelY < size; ++kernelY) {
                    for (var kernelX = 0; kernelX < size; ++kernelX) {
                        var weight = normalizedKernel.data[kernelY * size + kernelX];
                        var neighborY = Math.min(
                            height - 1, Math.max(0, pixelY + kernelY - half));
                        var neighborX = Math.min(
                            width - 1, Math.max(0, pixelX + kernelX - half));
                        var inputIndex = (neighborY * width + neighborX) * 4;

                        r += inputData[inputIndex] * weight;
                        g += inputData[inputIndex + 1] * weight;
                        b += inputData[inputIndex + 2] * weight;
                        a += inputData[inputIndex + 3] * weight;
                    }
                }
                var outputIndex = (pixelsAbove + pixelX) * 4;
                outputData[outputIndex] = r;
                outputData[outputIndex + 1] = g;
                outputData[outputIndex + 2] = b;
                outputData[outputIndex + 3] = normalizedKernel.normalized ? a : 255;
            }
        }
        context.putImageData(output, 0, 0);
    }

    //将Rgb进行拉伸
    RgbNormal(context){
        
    }




}