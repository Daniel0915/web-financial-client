import{_ as m,r as v,e as g,o as _,c as x,b}from"./index-CBllm15o.js";const h={class:"app"},P={__name:"WebGPU",setup(w){const a=v(null);return g(async()=>{if(!navigator.gpu){console.error("WebGPU를 지원하지 않는 브라우저입니다.");return}const e=await(await navigator.gpu.requestAdapter()).requestDevice(),r=a.value.getContext("webgpu"),n=navigator.gpu.getPreferredCanvasFormat();r.configure({device:e,format:n,alphaMode:"opaque"});const s=new Float32Array([0,.5,1,0,0,-.5,-.5,0,1,0,.5,-.5,0,0,1]),o=e.createBuffer({size:s.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(o.getMappedRange()).set(s),o.unmap();const c=e.createShaderModule({code:`
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
    `}),l=e.createRenderPipeline({layout:"auto",vertex:{module:c,entryPoint:"vs_main",buffers:[{arrayStride:5*4,attributes:[{shaderLocation:0,offset:0,format:"float32x2"},{shaderLocation:1,offset:8,format:"float32x3"}]}]},fragment:{module:c,entryPoint:"fs_main",targets:[{format:n}]},primitive:{topology:"triangle-list"}});function p(){const u=e.createCommandEncoder(),d=r.getCurrentTexture().createView(),t=u.beginRenderPass({colorAttachments:[{view:d,clearValue:{r:.1,g:.1,b:.1,a:1},loadOp:"clear",storeOp:"store"}]});t.setPipeline(l),t.setVertexBuffer(0,o),t.draw(3),t.end(),e.queue.submit([u.finish()])}function i(){p(),requestAnimationFrame(i)}i()}),(f,e)=>(_(),x("div",h,[b("canvas",{ref_key:"canvas",ref:a,width:"800",height:"600"},null,512)]))}},V=m(P,[["__scopeId","data-v-82ba962e"]]);export{V as default};
