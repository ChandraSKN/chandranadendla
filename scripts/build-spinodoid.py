"""Representative GRF reconstruction, not the original experimental mesh.
Run with numpy, scikit-image and trimesh installed.
Method reference: https://www.gibboncode.org/html/HELP_spinodoid.html
"""
from pathlib import Path
import numpy as np
from skimage.measure import marching_cubes
import trimesh
rng = np.random.default_rng(2719689)
n = 75
axis = np.linspace(0, 1, n, dtype=np.float32)
field = np.zeros((n,n,n), dtype=np.float32)
# [90,0,0]: isotropic directions; 1000 waves and wavenumber 15*pi.
for _ in range(1000):
    direction = rng.normal(size=3); direction /= np.linalg.norm(direction)
    phase = rng.uniform(0, 2*np.pi)
    field += np.cos(15*np.pi*(direction[0]*axis[:,None,None]+direction[1]*axis[None,:,None]+direction[2]*axis[None,None,:])+phase)
field *= np.sqrt(2/1000)
v,f,_,_ = marching_cubes(field, level=0, spacing=(30/(n-1),)*3)
base = trimesh.Trimesh(v,f,process=True)
base = max(base.split(only_watertight=False), key=lambda m: len(m.faces))
v,f = base.vertices,base.faces
normals = base.vertex_normals
# Offset both sides by half of 0.48 mm, closing the boundary edges.
vertices = np.vstack((v+normals*0.24,v-normals*0.24))
count=len(v)
edges=np.vstack((f[:,[0,1]],f[:,[1,2]],f[:,[2,0]]))
_,indices,counts=np.unique(np.sort(edges,axis=1),axis=0,return_index=True,return_counts=True)
boundary=edges[indices[counts==1]]
a,b=boundary.T
caps=np.vstack((np.column_stack((b,a,a+count)),np.column_stack((b,a+count,b+count))))
faces=np.vstack((f,f[:,::-1]+count,caps))
mesh=trimesh.Trimesh((vertices-15)/1000,faces,process=True)
mesh.fix_normals()
mesh.visual=trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(baseColorFactor=[104,139,95,255],metallicFactor=0.12,roughnessFactor=0.48,doubleSided=True))
mesh.metadata={'description':'Representative reconstruction; not the original tested specimen','nominal_dimensions_mm':[30,30,30],'wall_thickness_mm':0.48,'thetas':[90,0,0],'seed':2719689}
out=Path(__file__).resolve().parents[1]/'projects/spinodoid/spinodoid.glb'
mesh.export(out)
assert mesh.is_watertight
print(f'{out.name}: {len(mesh.vertices)} vertices, {len(mesh.faces)} triangles, {out.stat().st_size} bytes; watertight={mesh.is_watertight}')
