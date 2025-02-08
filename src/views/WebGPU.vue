<script setup>
import { onMounted, ref } from 'vue';

const canvas = ref(null);

onMounted(async () => {
    if (!navigator.gpu) {
        console.error('WebGPU를 지원하지 않는 브라우저입니다.');
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const context = canvas.value.getContext('webgpu');

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format,
        alphaMode: 'opaque',
    });

    // 버퍼 데이터 (삼각형 좌표 및 색상)
    const vertices = new Float32Array([
        0, 0.5, 1, 0, 0,   // 상단 (빨강)
        -0.5, -0.5, 0, 1, 0, // 좌측 하단 (초록)
        0.5, -0.5, 0, 0, 1, // 우측 하단 (파랑)
    ]);

    const vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
    vertexBuffer.unmap();

    // 셰이더 코드 (WGSL)
    const shaderModule = device.createShaderModule({
        code: `
      struct VertexOutput {
        @builtin(position) Position : vec4<f32>;
        @location(0) color : vec3<f32>;
      };

      @vertex
      fn vs_main(@location(0) pos: vec2<f32>, @location(1) color: vec3<f32>) -> VertexOutput {
        var output: VertexOutput;
        output.Position = vec4<f32>(pos, 0.0, 1.0);
        output.color = color;
        return output;
      }

      @fragment
      fn fs_main(@location(0) color: vec3<f32>) -> @location(0) vec4<f32> {
        return vec4<f32>(color, 1.0);
      }
    `,
    });

    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
            buffers: [
                {
                    arrayStride: 5 * 4, // 2(float) + 3(float) = 20 bytes
                    attributes: [
                        { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
                        { shaderLocation: 1, offset: 8, format: 'float32x3' }, // color
                    ],
                },
            ],
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs_main',
            targets: [{ format }],
        },
        primitive: {
            topology: 'triangle-list',
        },
    });

    function draw() {
        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        });

        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.draw(3);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    animate();
});
</script>

<template>
    <div class="app">
        <canvas ref="canvas" width="800" height="600"></canvas>
    </div>
</template>

<style scoped lang="scss">
.app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
}
canvas {
    border: 1px solid #fff;
}

</style>
