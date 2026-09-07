"""Build an original stylized human avatar with a pointing arm, no external assets."""
from pathlib import Path
import json, struct, math
import numpy as np
root=Path(__file__).resolve().parents[1]
binary=bytearray(); views=[]; accessors=[]; meshes=[]; nodes=[]
colors=['#78936a','#293d32','#bd8765','#302d29','#f1efe5','#25332c']
materials=[{'name':name,'pbrMetallicRoughness':{'baseColorFactor':[int(color[i:i+2],16)/255 for i in (1,3,5)]+[1],'metallicFactor':0,'roughnessFactor':.8}} for name,color in zip(['Sage knit','Charcoal trousers','Warm skin','Hair','Sneakers','Eyes'],colors)]
def accessor(arr,kind):
 arr=np.asarray(arr,dtype='<f4');idx=len(views);data=arr.tobytes();views.append({'buffer':0,'byteOffset':len(binary),'byteLength':len(data)});binary.extend(data)
 accessors.append({'bufferView':idx,'componentType':5126,'count':len(arr),'type':kind,'min':arr.min(axis=0).tolist(),'max':arr.max(axis=0).tolist()});return len(accessors)-1
def ball(name,center,scale,mat,parent=None,rotation=None):
 # Smooth ellipsoids form a cohesive toy-like character.
 vertices=[]; normals=[]; R=np.eye(3) if rotation is None else rotation
 def point(i,j):
  a=math.pi*i/16;b=math.tau*j/24
  n=np.array([math.sin(a)*math.cos(b),math.cos(a),math.sin(a)*math.sin(b)])
  v=R@(n*np.array(scale));normal=R@(n/np.array(scale));normal/=np.linalg.norm(normal)
  return v.tolist(),normal.tolist()
 for i in range(16):
  for j in range(24):
   for a,b in [(i,j),(i+1,j+1),(i+1,j),(i,j),(i,j+1),(i+1,j+1)]:
    v,n=point(a,b);vertices.append(v);normals.append(n)
 pos=accessor(vertices,'VEC3');norm=accessor(normals,'VEC3');mi=len(meshes);meshes.append({'primitives':[{'attributes':{'POSITION':pos,'NORMAL':norm},'material':mat}]})
 ni=len(nodes);nodes.append({'name':name,'mesh':mi,'translation':list(center)})
 if parent is not None:nodes[parent].setdefault('children',[]).append(ni)
 return ni
def limb(name,a,b,r,mat,parent=None):
 a=np.array(a);b=np.array(b);d=b-a;length=np.linalg.norm(d);y=d/length;x=np.cross(y,[0,0,1]);x/=np.linalg.norm(x);z=np.cross(x,y);R=np.column_stack([x,y,z]);return ball(name,(a+b)/2,[r,length/2+r*.3,r],mat,parent,R)
ball('Left trouser',[-.22,.68,0],[.19,.61,.2],1);ball('Right trouser',[.22,.68,0],[.19,.61,.2],1)
ball('Left sneaker',[-.22,.12,.1],[.22,.13,.34],4);ball('Right sneaker',[.22,.12,.1],[.22,.13,.34],4)
ball('Sweater',[0,1.53,0],[.46,.62,.27],0);ball('Neck',[0,2.06,0],[.15,.21,.15],2)
ball('Head',[0,2.46,.02],[.32,.41,.30],2)
ball('Hair cap',[0,2.72,-.04],[.335,.20,.28],3);ball('Side hair',[-.28,2.52,-.01],[.065,.20,.2],3)
for x in [-.325,.325]:ball('Ear',[x,2.44,.025],[.07,.12,.075],2)
for x in [-.115,.115]:
 ball('Eye white',[x,2.49,.295],[.069,.065,.021],4);ball('Pupil',[x+.016,2.49,.315],[.029,.033,.013],5)
ball('Nose',[.025,2.39,.32],[.055,.072,.065],2)
ball('Smile',[.035,2.27,.278],[.085,.016,.015],3)
limb('Relaxed sleeve',[-.36,1.83,0],[-.61,1.40,.02],.16,0)
limb('Relaxed forearm',[-.61,1.40,.02],[-.48,1.03,.13],.115,2)
ball('Relaxed hand',[-.47,1.02,.14],[.13,.15,.10],2)
arm=len(nodes);nodes.append({'name':'PointingArm','translation':[.36,1.85,0],'children':[]})
limb('Pointing sleeve',[0,0,0],[.43,-.18,.04],.155,0,arm)
limb('Pointing forearm',[.43,-.18,.04],[.80,.02,.08],.105,2,arm)
ball('Pointing palm',[.85,.045,.085],[.145,.10,.085],2,arm)
limb('Index finger',[.90,.10,.085],[1.19,.17,.085],.035,2,arm)
limb('Thumb',[.82,.025,.15],[.90,-.055,.16],.04,2,arm)
children={child for node in nodes for child in node.get('children',[])}
data={'asset':{'version':'2.0','generator':'Original portfolio stylized avatar'},'scene':0,'scenes':[{'nodes':[i for i in range(len(nodes)) if i not in children]}],'nodes':nodes,'meshes':meshes,'materials':materials,'accessors':accessors,'bufferViews':views,'buffers':[{'byteLength':len(binary)}]}
js=json.dumps(data,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
out=struct.pack('<III',0x46546c67,2,28+len(js)+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary
(root/'models/about-avatar.glb').write_bytes(out);print('Avatar GLB created:',len(out),'bytes')
