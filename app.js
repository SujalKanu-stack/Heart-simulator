/* ============================================================
   CardioSim 3D — Sketchfab Viewer API Integration
   Photorealistic heart model with interactive annotations
   ============================================================ */

// ── ANATOMY DATA ──
const ANATOMY = {
  1: { name:'Right Atrium', subtitle:'Chamber — Right Side', desc:'Receives all deoxygenated blood from the body. Contains the SA node (natural pacemaker) in its wall near the SVC opening.', fn:'Collects deoxygenated blood from the superior and inferior vena cava and coronary sinus, passing it through the tricuspid valve into the right ventricle.', blood:'Deoxygenated blood enters via SVC (upper body) and IVC (lower body). Atrial contraction completes ventricular filling.', color:'#4488ff' },
  2: { name:'Right Ventricle', subtitle:'Chamber — Right Side', desc:'Located anteriorly with thinner walls than LV. Has trabeculae carneae (muscle ridges) and moderator band on its internal surface.', fn:'Pumps deoxygenated blood through the pulmonary valve into the pulmonary artery toward both lungs for gas exchange.', blood:'Receives from RA via tricuspid valve. Generates ~25 mmHg systolic pressure (vs 120 mmHg in LV).', color:'#4488ff' },
  3: { name:'Left Atrium', subtitle:'Chamber — Left Side', desc:'Posterior thin-walled chamber. Receives oxygenated blood from four pulmonary veins (two from each lung). Smooth-walled except for the auricle.', fn:'Collects freshly oxygenated blood returning from the lungs and delivers it through the mitral valve into the left ventricle.', blood:'Oxygenated blood at low pressure fills this chamber. Atrial systole provides the final 20-30% of ventricular filling.', color:'#ff6b8a' },
  4: { name:'Left Ventricle', subtitle:'Chamber — Left Side', desc:'The most powerful chamber with walls 1.0-1.5 cm thick — 3x thicker than RV. Forms the apex and most of the left/inferior heart border.', fn:'Pumps oxygen-rich blood at high pressure through the aortic valve into the aorta, supplying the entire systemic circulation.', blood:'Generates 120 mmHg systolic pressure. Stroke volume ~70 mL per beat. Cardiac output ~5 L/min at rest.', color:'#ff3355' },
  5: { name:'Aorta', subtitle:'Largest Artery in the Body', desc:'~2.5 cm diameter. Ascending aorta → aortic arch (3 branches: brachiocephalic, L common carotid, L subclavian) → descending aorta.', fn:'Main conduit distributing oxygenated blood from LV to every organ. The aortic root contains the sinuses of Valsalva where coronary arteries originate.', blood:'Carries highest-pressure blood (~120/80 mmHg). Elastic walls stretch during systole and recoil during diastole (Windkessel effect).', color:'#ff3355' },
  6: { name:'Pulmonary Artery', subtitle:'The Only Blue Artery', desc:'Bifurcates into left and right pulmonary arteries. Connected to the aorta by the ligamentum arteriosum (remnant of ductus arteriosus).', fn:'Carries deoxygenated blood from RV to pulmonary capillaries for O₂ loading and CO₂ removal.', blood:'Lower pressure than aorta (~25/10 mmHg). Short distance to lungs means RV needs less muscle mass.', color:'#4488ff' },
  7: { name:'Superior Vena Cava', subtitle:'Major Vein — Upper Body', desc:'Formed by junction of L and R brachiocephalic veins behind the 1st right costal cartilage. ~7 cm long, no valves.', fn:'Returns deoxygenated blood from head, neck, upper limbs, and upper thorax to the right atrium.', blood:'Low-pressure venous return. Flow aided by respiratory pump (negative intrathoracic pressure during inspiration).', color:'#4488ff' },
  8: { name:'Inferior Vena Cava', subtitle:'Largest Vein in the Body', desc:'Begins at L5 vertebral level from union of common iliac veins. Passes through diaphragm at T8 vertebral level.', fn:'Returns deoxygenated blood from abdomen, pelvis, and lower extremities to the right atrium.', blood:'Carries the largest single volume of venous return. Hepatic veins drain into it just below the diaphragm.', color:'#4488ff' },
  9: { name:'Pulmonary Veins', subtitle:'The Only Red Veins (×4)', desc:'Four veins, two from each lung (superior and inferior). They have no valves and enter the posterior wall of the left atrium.', fn:'Transport freshly oxygenated blood from pulmonary capillaries back to the left atrium.', blood:'Carry oxygenated blood at ~8 mmHg. Abnormal connections (TAPVR) are a serious congenital defect.', color:'#ff3355' },
  10: { name:'Coronary Arteries', subtitle:'Heart\'s Own Blood Supply', desc:'LCA (splits into LAD + circumflex) and RCA branch from aortic root. Supply the entire myocardium.', fn:'Deliver O₂ and nutrients to heart muscle cells. Blockage → myocardial infarction. Peak filling during diastole.', blood:'Receive 5% of cardiac output despite heart being <1% of body weight. Extraction rate ~75% (highest of any organ).', color:'#ff3355' },
  11: { name:'Tricuspid Valve', subtitle:'Right AV Valve — 3 Leaflets', desc:'Three leaflets (anterior, posterior, septal) anchored by chordae tendineae to 3 papillary muscles in RV wall.', fn:'One-way gate: opens during diastole for RV filling, snaps shut during systole to prevent backflow to RA.', blood:'Closure contributes to S1 heart sound ("lub"). Tricuspid regurgitation causes systolic murmur and jugular venous distension.', color:'#ffcc00' },
  12: { name:'Mitral Valve', subtitle:'Left AV Valve — 2 Leaflets', desc:'Also called bicuspid valve. Two leaflets (anterior and posterior) with chordae tendineae to 2 papillary muscles. Most commonly diseased valve.', fn:'Prevents backflow from LV to LA during systole. Mitral stenosis and prolapse are common pathologies.', blood:'Closure is the dominant component of S1 ("lub"). Best auscultated at the cardiac apex (5th intercostal space, midclavicular line).', color:'#ffcc00' },
  13: { name:'Aortic Valve', subtitle:'Semilunar Valve — 3 Cusps', desc:'Three crescent-shaped cusps (left, right, non-coronary). Located at the LV outflow tract. Most common valve requiring replacement.', fn:'Opens during systole for blood ejection into aorta. Prevents regurgitation during diastole when coronary arteries fill.', blood:'Closure produces S2 heart sound ("dub"). Aortic stenosis → systolic ejection murmur; regurgitation → diastolic murmur.', color:'#ffcc00' },
  14: { name:'Pulmonary Valve', subtitle:'Semilunar Valve — 3 Cusps', desc:'Three cusps at RV-PA junction. Least commonly affected by acquired disease. Important in congenital heart defects (Tetralogy of Fallot).', fn:'Opens during RV systole. Prevents backflow from pulmonary artery into RV during diastole.', blood:'Lower-pressure valve than aortic. Pulmonary stenosis can cause RV hypertrophy and cyanosis in severe cases.', color:'#ffcc00' },
  15: { name:'Interventricular Septum', subtitle:'Chamber Dividing Wall', desc:'Thick muscular wall (muscular part ~10mm, thin membranous part ~2mm). Separates LV and RV preventing blood mixing.', fn:'Maintains complete separation of systemic (oxygenated) and pulmonary (deoxygenated) circulations.', blood:'VSD (ventricular septal defect) is the most common congenital heart defect — causes left-to-right shunting.', color:'#cc3355' },
  16: { name:'SA Node', subtitle:'The Heart\'s Natural Pacemaker', desc:'Small crescent of specialized cells in the RA wall near SVC junction. Intrinsic rate 60-100 bpm. Richly innervated by autonomic nerves.', fn:'Generates spontaneous electrical impulses that trigger each heartbeat. Sets the sinus rhythm for the entire heart.', blood:'Supplied by SA nodal artery (from RCA in 60%, LCx in 40%). Dysfunction causes sick sinus syndrome.', color:'#00ffd5' },
  17: { name:'AV Node', subtitle:'Electrical Relay Station', desc:'Located in the triangle of Koch at the interatrial septum near the tricuspid valve. Introduces critical 0.12-0.20 second delay.', fn:'Delays impulse from SA node, ensuring atria contract and empty before ventricles begin contraction.', blood:'Backup pacemaker at 40-60 bpm if SA node fails. Heart block occurs if AV conduction is impaired.', color:'#00ffd5' },
  18: { name:'Bundle of His', subtitle:'Ventricular Conduction Trunk', desc:'Specialized conducting tissue that exits the AV node, passes through the fibrous cardiac skeleton, and divides into right and left bundle branches along the septum.', fn:'Carries the delayed impulse from the AV node into the ventricles so contraction starts in a timed, organized sequence.', blood:'Electrical conduction rather than blood transport. Ischemia or fibrosis can produce bundle branch block and inefficient ventricular activation.', color:'#00ffd5' },
  19: { name:'Purkinje Fibers', subtitle:'Rapid Ventricular Conduction Network', desc:'Fine branching fibers spread through the subendocardial ventricular walls. They conduct faster than ordinary myocardium, activating large ventricular regions almost simultaneously.', fn:'Distribute the electrical impulse from the bundle branches to ventricular muscle, triggering coordinated contraction from apex toward the outflow tracts.', blood:'They coordinate ejection of blood from both ventricles; injury can contribute to ventricular arrhythmias.', color:'#00ffd5' },
  20: { name:'Chordae Tendineae', subtitle:'Valve Support Cords', desc:'Strong collagenous cords connecting the mitral and tricuspid valve leaflets to papillary muscles. They prevent valve leaflets from prolapsing backward under systolic pressure.', fn:'Stabilize atrioventricular valves during ventricular contraction, preserving one-way blood flow from atria to ventricles.', blood:'They do not carry blood, but they prevent regurgitant flow back into the atria during systole.', color:'#ffcc00' },
  21: { name:'Papillary Muscles', subtitle:'Ventricular Valve Anchors', desc:'Muscular projections from the ventricular walls that attach to chordae tendineae. The left ventricle has anterolateral and posteromedial papillary muscles; the right has three major groups.', fn:'Contract with the ventricles to tense the chordae and keep the mitral and tricuspid valves sealed during systole.', blood:'Protects forward ejection by preventing blood from leaking back into the atria. Papillary muscle ischemia can cause acute valve regurgitation.', color:'#ffcc00' },
  22: { name:'Myocardium', subtitle:'Cardiac Muscle Layer', desc:'The thick contractile middle layer of the heart wall. It is composed of interconnected cardiac muscle cells rich in mitochondria and supplied by coronary arteries.', fn:'Generates the mechanical force for every heartbeat, with the left ventricular myocardium producing the highest pressure for systemic circulation.', blood:'Receives oxygenated blood through coronary arteries. Reduced flow causes ischemia, chest pain, arrhythmias, or myocardial infarction.', color:'#ff6b8a' },
  23: { name:'Endocardium', subtitle:'Inner Heart Lining', desc:'A smooth endothelial lining covering the inside of chambers and valves. It reduces friction and creates a non-thrombogenic surface for moving blood.', fn:'Allows blood to glide through chambers and across valves while supporting normal valve structure and electrical conduction surfaces.', blood:'Directly contacts intracardiac blood. Infection can cause endocarditis, especially on damaged valves.', color:'#9be7ff' },
  24: { name:'Epicardium', subtitle:'Outer Visceral Pericardium', desc:'The thin outer layer of the heart wall and visceral layer of serous pericardium. It contains fat, nerves, coronary vessels, and connective tissue.', fn:'Protects the myocardium and provides a surface for coronary vessels that supply the beating heart muscle.', blood:'Coronary arteries and veins course through the epicardial surface before branching into the myocardium.', color:'#ff9aa8' },
};

// ── GUIDED STEPS ──
const GUIDED_STEPS = [
  { title:'Welcome to CardioSim 3D', text:'Explore this photorealistic 3D heart model. Rotate by dragging, zoom with scroll, and click numbered markers to learn about each structure. Let\'s walk through the blood flow!' },
  { title:'Step 1: Deoxygenated Blood Returns', text:'Blood that has delivered oxygen returns via the Superior Vena Cava (#7, upper body) and Inferior Vena Cava (#8, lower body) into the Right Atrium (#1).' },
  { title:'Step 2: Right Ventricle Pumps to Lungs', text:'Blood flows through the Tricuspid Valve (#11) into the Right Ventricle (#2), which pumps it through the Pulmonary Valve (#14) into the Pulmonary Artery (#6) toward the lungs.' },
  { title:'Step 3: Gas Exchange in the Lungs', text:'In the lung capillaries, CO₂ is exhaled and O₂ is absorbed. The now oxygen-rich blood returns via four Pulmonary Veins (#9) to the Left Atrium (#3).' },
  { title:'Step 4: The Powerful Left Side', text:'Blood passes through the Mitral Valve (#12) into the massive Left Ventricle (#4). Its thick walls generate 120mmHg to push blood through the Aortic Valve (#13) into the Aorta (#5).' },
  { title:'Step 5: Systemic Circulation', text:'The Aorta distributes oxygenated blood to every organ. The Coronary Arteries (#10) branch off to feed the heart muscle itself. The cycle repeats ~100,000 times daily!' },
  { title:'Step 6: Electrical Conduction', text:'The SA Node (#16) fires an impulse → spreads across atria → AV Node (#17) delays briefly → Bundle of His & Purkinje Fibers (#18) rapidly activate the ventricles from apex upward.' },
  { title:'Exploration Complete!', text:'You now understand the complete cardiac cycle! Continue exploring by rotating the model, clicking structures, or try the Quiz Mode to test your knowledge.' },
];

// ── QUIZ ──
const QUIZ = [
  { q:'Which chamber pumps oxygenated blood to the entire body?', opts:['Right Ventricle','Left Atrium','Left Ventricle','Right Atrium'], ans:2, explain:'The Left Ventricle has the thickest walls and generates 120mmHg to pump through the aorta.' },
  { q:'What is the heart\'s natural pacemaker?', opts:['AV Node','Bundle of His','Purkinje Fibers','SA Node'], ans:3, explain:'The SA Node generates 60-100 impulses/min, setting the sinus rhythm.' },
  { q:'Which valve prevents backflow from the left ventricle to the left atrium?', opts:['Tricuspid','Aortic','Pulmonary','Mitral'], ans:3, explain:'The Mitral (bicuspid) Valve has two leaflets guarding the left AV opening.' },
  { q:'Which vessel carries deoxygenated blood from the heart to the lungs?', opts:['Aorta','Pulmonary Artery','Pulmonary Veins','Vena Cava'], ans:1, explain:'The Pulmonary Artery is the only artery carrying deoxygenated blood.' },
  { q:'What structure separates the left and right ventricles?', opts:['Interventricular Septum','Pericardium','Endocardium','Myocardium'], ans:0, explain:'The interventricular septum prevents mixing of oxygenated and deoxygenated blood.' },
  { q:'Where do the coronary arteries originate?', opts:['Pulmonary artery','Vena cava','Aortic root','Left atrium'], ans:2, explain:'Coronary arteries branch from the aortic root, filling during diastole.' },
];

// ── GLOBALS ──
let api = null;
let heartRateBPM = 72;
let diseaseMode = 'healthy';
let beatInterval = null;
let activeStructureId = null;
let hoverCallout = null;
let hoverTooltip = null;
let flowOverlay = null;
let latestPointer = { x: window.innerWidth * 0.52, y: window.innerHeight * 0.48 };
let anatomyNodeCache = new Map();
let activeHover = null;
let hoverFrame = null;
let hoverHideTimer = null;

const GENERIC_HEART_INFO = {
  name: 'Heart Wall / Myocardium',
  subtitle: 'Cardiac Muscle Tissue',
  desc: 'The myocardium is the thick muscular layer of the heart wall. It is made of specialized cardiac muscle cells that contract rhythmically and are linked electrically so the chambers can beat in a coordinated way.',
  fn: 'Creates the pumping force that moves blood through the pulmonary and systemic circulations. Its contraction during systole ejects blood, and relaxation during diastole allows the chambers to fill.',
  blood: 'The myocardium is supplied by the coronary arteries. Reduced coronary flow can cause ischemia, chest pain, arrhythmias, or myocardial infarction.',
  color: '#ff6b8a'
};

const STRUCTURE_META = {
  1: { flowType: 'deoxygenated', path: ['Superior vena cava', 'Inferior vena cava', 'Right atrium', 'Tricuspid valve'], facts: ['Receives systemic venous return', 'Channels blood to the right ventricle', 'Connected to the SVC, IVC, and coronary sinus'] },
  2: { flowType: 'deoxygenated', path: ['Tricuspid valve', 'Right ventricle', 'Pulmonary valve', 'Pulmonary artery'], facts: ['Main pulmonary pumping chamber', 'Lower pressure than the left ventricle', 'Sends blood to the lungs for gas exchange'] },
  3: { flowType: 'oxygenated', path: ['Pulmonary veins', 'Left atrium', 'Mitral valve', 'Left ventricle'], facts: ['Receives oxygen-rich blood from the lungs', 'Smooth posterior chamber', 'Completes left ventricular filling during atrial systole'] },
  4: { flowType: 'oxygenated', path: ['Mitral valve', 'Left ventricle', 'Aortic valve', 'Aorta'], facts: ['Main systemic pumping chamber', 'Thick muscular wall generates high pressure', 'Forms the cardiac apex'] },
  5: { flowType: 'oxygenated', path: ['Left ventricle', 'Aortic valve', 'Aorta', 'Systemic arteries'], facts: ['Largest artery in the body', 'Distributes oxygenated blood to organs', 'Elastic recoil maintains diastolic flow'] },
  6: { flowType: 'deoxygenated', path: ['Right ventricle', 'Pulmonary valve', 'Pulmonary artery', 'Lungs'], facts: ['Only major artery carrying deoxygenated blood', 'Bifurcates to both lungs', 'Operates at low pulmonary pressure'] },
  7: { flowType: 'deoxygenated', path: ['Head and upper limbs', 'Superior vena cava', 'Right atrium'], facts: ['Drains the upper body', 'Large valveless vein', 'Feeds the right atrium'] },
  8: { flowType: 'deoxygenated', path: ['Lower body', 'Inferior vena cava', 'Right atrium'], facts: ['Drains abdomen, pelvis, and legs', 'Largest vein in the body', 'Receives hepatic venous blood'] },
  9: { flowType: 'oxygenated', path: ['Lungs', 'Pulmonary veins', 'Left atrium'], facts: ['Only major veins carrying oxygenated blood', 'Usually four veins enter the left atrium', 'Return blood after gas exchange'] },
  10: { flowType: 'oxygenated', path: ['Aortic root', 'Coronary arteries', 'Myocardium'], facts: ['Supplies the heart muscle itself', 'Left coronary branches include LAD and circumflex', 'Flow is greatest during diastole'] },
  11: { flowType: 'deoxygenated', path: ['Right atrium', 'Tricuspid valve', 'Right ventricle'], facts: ['Right atrioventricular valve', 'Three leaflets', 'Prevents backflow into the right atrium'] },
  12: { flowType: 'oxygenated', path: ['Left atrium', 'Mitral valve', 'Left ventricle'], facts: ['Left atrioventricular valve', 'Two leaflets', 'Prevents backflow into the left atrium'] },
  13: { flowType: 'oxygenated', path: ['Left ventricle', 'Aortic valve', 'Aorta'], facts: ['Semilunar outflow valve', 'Opens during ventricular systole', 'Prevents aortic regurgitation'] },
  14: { flowType: 'deoxygenated', path: ['Right ventricle', 'Pulmonary valve', 'Pulmonary artery'], facts: ['Semilunar outflow valve', 'Protects the right ventricle from backflow', 'Important in congenital outflow disease'] },
  15: { flowType: 'mixed', path: ['Right ventricle', 'Septum barrier', 'Left ventricle'], facts: ['Separates right and left ventricles', 'Prevents mixing of blood', 'Contains conduction pathways'] },
  16: { flowType: 'electrical', path: ['SA node', 'Atria', 'AV node'], facts: ['Natural pacemaker', 'Sets sinus rhythm', 'Located near the SVC opening'] },
  17: { flowType: 'electrical', path: ['Atria', 'AV node', 'Bundle of His'], facts: ['Electrical relay station', 'Creates AV delay', 'Coordinates atria before ventricles'] },
  18: { flowType: 'electrical', path: ['AV node', 'Bundle of His', 'Bundle branches'], facts: ['Insulated conduction trunk', 'Crosses the fibrous skeleton', 'Feeds both ventricles'] },
  19: { flowType: 'electrical', path: ['Bundle branches', 'Purkinje fibers', 'Ventricular myocardium'], facts: ['Fastest conduction network', 'Activates ventricles from apex upward', 'Supports synchronized ejection'] },
  20: { flowType: 'structural', path: ['Valve leaflet', 'Chordae tendineae', 'Papillary muscle'], facts: ['Tether AV valve leaflets', 'Prevent prolapse', 'Critical for one-way flow'] },
  21: { flowType: 'structural', path: ['Ventricular wall', 'Papillary muscle', 'Chordae tendineae'], facts: ['Anchor the chordae', 'Contract during systole', 'Protect valves from regurgitation'] },
  22: { flowType: 'oxygenated', path: ['Coronary arteries', 'Myocardium', 'Coronary veins'], facts: ['Contractile heart muscle', 'High oxygen demand', 'Powers chamber pumping'] },
  23: { flowType: 'mixed', path: ['Chamber blood', 'Endocardium', 'Valve surfaces'], facts: ['Smooth inner lining', 'Reduces friction', 'Clinically important in endocarditis'] },
  24: { flowType: 'oxygenated', path: ['Epicardial coronaries', 'Epicardium', 'Myocardial branches'], facts: ['Outer heart surface', 'Carries coronary vessels', 'Visceral pericardial layer'] },
};

const HOVER_MATCHERS = [
  { id: '1', terms: ['right atrium', 'atrium right', 'ra ', 'right auricle'] },
  { id: '2', terms: ['right ventricle', 'ventricle right', 'rv '] },
  { id: '3', terms: ['left atrium', 'atrium left', 'la ', 'left auricle'] },
  { id: '4', terms: ['left ventricle', 'ventricle left', 'lv ', 'apex'] },
  { id: '5', terms: ['aorta', 'aortic arch', 'ascending aorta'] },
  { id: '6', terms: ['pulmonary artery', 'pulmonary trunk'] },
  { id: '7', terms: ['superior vena cava', 'svc'] },
  { id: '8', terms: ['inferior vena cava', 'ivc'] },
  { id: '9', terms: ['pulmonary vein', 'pulmonary veins'] },
  { id: '10', terms: ['coronary', 'lad', 'circumflex', 'right coronary', 'left coronary'] },
  { id: '11', terms: ['tricuspid'] },
  { id: '12', terms: ['mitral', 'bicuspid'] },
  { id: '13', terms: ['aortic valve'] },
  { id: '14', terms: ['pulmonary valve'] },
  { id: '15', terms: ['septum', 'interventricular'] },
  { id: '16', terms: ['sa node', 'sinoatrial'] },
  { id: '17', terms: ['av node', 'atrioventricular'] },
  { id: '18', terms: ['bundle of his', 'bundle branch'] },
  { id: '19', terms: ['purkinje'] },
  { id: '20', terms: ['chordae', 'tendineae', 'tendon cords'] },
  { id: '21', terms: ['papillary'] },
  { id: '22', terms: ['myocardium', 'myocardial', 'heart wall', 'muscle'] },
  { id: '23', terms: ['endocardium', 'endocardial', 'inner lining'] },
  { id: '24', terms: ['epicardium', 'epicardial', 'outer layer'] },
];

// ============================================================
//  INIT SKETCHFAB VIEWER
// ============================================================
function initViewer() {
  const iframe = document.getElementById('api-frame');
  // Realistic anatomical heart model from Sketchfab
  const uid = '168b474fba564f688048212e99b4159d'; // 3D Animated Realistic Human Heart V2.0
  // Fallback UIDs for known good heart models:
  const fallbackUids = [
    'a70c0c47fe4b4bbfabfc8f445365d5a4', // 3D Animated Realistic Human Heart V1.0
    '775d6629622740de8a5ed61a959c7506', // [Animation] Human Heart
    '1b7bfb07e6b24dd891099395ed98e989', // Human Heart Anatomy Labeled
  ];

  const client = new Sketchfab(iframe);

  const viewerOptions = {
    autostart: 1,
    autospin: 0.3,
    preload: 1,
    transparent: 0,
    ui_animations: 0,
    ui_infos: 0,
    ui_stop: 0,
    ui_inspector: 0,
    ui_watermark_link: 0,
    ui_watermark: 0,
    ui_ar: 0,
    ui_help: 0,
    ui_settings: 0,
    ui_vr: 0,
    ui_fullscreen: 0,
    ui_annotations: 0,
    scrollwheel: 1,
    double_click: 0,
    camera: 0,
    ui_controls: 0,
    graph_optimizer: 0,
    merge_materials: 0,
  };

  function tryInit(modelUid) {
    client.init(modelUid, {
      ...viewerOptions,
      success: function(apiResult) {
        api = apiResult;
        api.start();
        api.addEventListener('viewerready', function() {
          console.log('Viewer ready!');
          document.getElementById('loading-screen').style.opacity = '0';
          setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
          }, 800);
          setupViewer();
        });
      },
      error: function() {
        console.warn('Model ' + modelUid + ' failed, trying fallback...');
        // Try first fallback
        if (fallbackUids.length) {
          tryInit(fallbackUids.shift());
        } else {
          document.getElementById('loaderText').textContent = 'Could not load model. Using procedural heart.';
          loadProceduralFallback();
        }
      }
    });
  }

  // Update loader
  const fill = document.getElementById('loaderFill');
  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 15, 90);
    fill.style.width = progress + '%';
  }, 300);

  // Listen for actual load complete
  setTimeout(() => {
    clearInterval(loaderInterval);
    fill.style.width = '100%';
  }, 8000);

  tryInit(uid);
}

function loadProceduralFallback() {
  // If Sketchfab fails, load via iframe embed instead (guaranteed to work)
  const iframe = document.getElementById('api-frame');
  iframe.src = 'https://sketchfab.com/models/a70c0c47fe4b4bbfabfc8f445365d5a4/embed?autostart=1&ui_theme=dark&dnt=1';
  document.getElementById('loading-screen').style.display = 'none';
}

function setupViewer() {
  // Set dark background
  if (api) {
    api.setBackground({color: [0.02, 0.02, 0.04]});
  }
  setupAnatomyOverlay();
  buildStructureList();
  setupHoverInteractions();
  startHeartbeat();
}

function setupAnatomyOverlay() {
  if (hoverCallout) return;

  hoverCallout = document.createElement('div');
  hoverCallout.className = 'anatomy-callout in-model-callout hidden';
  hoverCallout.innerHTML = `
    <span class="callout-dot"></span>
    <span class="callout-line"></span>
    <span class="callout-name"></span>
  `;
  document.body.appendChild(hoverCallout);

  hoverTooltip = document.createElement('div');
  hoverTooltip.className = 'hover-tooltip in-model-tooltip hidden';
  document.body.appendChild(hoverTooltip);

  flowOverlay = document.createElement('div');
  flowOverlay.className = 'flow-overlay hidden';
  flowOverlay.innerHTML = `
    <div class="flow-title">Blood Flow Pathway</div>
    <div class="flow-track">
      <span class="flow-particle p1"></span>
      <span class="flow-particle p2"></span>
      <span class="flow-particle p3"></span>
    </div>
    <div class="flow-steps"></div>
  `;
  document.body.appendChild(flowOverlay);

  window.addEventListener('mousemove', event => {
    latestPointer = { x: event.clientX, y: event.clientY };
    positionHoverEffects();
  });
  window.addEventListener('resize', positionHoverEffects);
}

// ============================================================
//  STRUCTURE LIST + INFO CARDS
// ============================================================
function buildStructureList() {
  const container = document.getElementById('structureList');
  container.innerHTML = '';
  for (const [id, data] of Object.entries(ANATOMY)) {
    const item = document.createElement('button');
    item.className = 'structure-item';
    item.dataset.structureId = id;
    item.innerHTML = `<span class="struct-num" style="background:${data.color}">${id}</span> ${data.name}`;
    item.addEventListener('mouseenter', () => showInfo(id, { source: 'list-hover' }));
    item.addEventListener('focus', () => showInfo(id, { source: 'list-hover' }));
    item.addEventListener('click', () => showInfo(id, { source: 'list-click' }));
    container.appendChild(item);
  }
}

function showInfo(id, options = {}) {
  const d = ANATOMY[id] || GENERIC_HEART_INFO;
  if (!d) return;
  activeStructureId = ANATOMY[id] ? String(id) : null;
  updateActiveStructure(id);
  const meta = STRUCTURE_META[id] || { flowType: 'structural', path: ['Selected tissue', d.name, 'Anatomical context'], facts: [] };
  const card = document.getElementById('infoCard');
  const badge = ANATOMY[id] ? `<span class="info-num" style="background:${d.color}">${id}</span>` : '';
  const sourceLabel = options.source === 'viewer-hover' ? 'Hovered structure' : 'Selected structure';
  const flowLabel = getFlowLabel(meta.flowType);
  const facts = meta.facts.length ? meta.facts : [d.desc, d.fn, d.blood];
  card.classList.remove('is-visible');
  card.innerHTML = `<div class="info-active">
    <div class="info-kicker">${sourceLabel}</div>
    <div class="info-name" style="color:${d.color}">${badge} ${d.name}</div>
    <div class="info-subtitle">${d.subtitle}</div>
    <div class="flow-chip ${meta.flowType}">${flowLabel}</div>
    <ul class="medical-points">${facts.map(fact => `<li>${fact}</li>`).join('')}</ul>
    <p class="info-desc">${d.desc}</p>
    <div class="info-function"><strong>⚙️ Function:</strong> ${d.fn}</div>
    <div class="info-blood-role"><strong>🩸 Blood Flow:</strong> ${d.blood}</div>
  </div>`;
  requestAnimationFrame(() => card.classList.add('is-visible'));
  showAnatomyEffects(d, meta, options.source);
}

function updateActiveStructure(id) {
  document.querySelectorAll('.structure-item').forEach(item => {
    item.classList.toggle('active', item.dataset.structureId === String(id));
  });
}

function getFlowLabel(type) {
  const labels = {
    oxygenated: 'Oxygenated blood flow',
    deoxygenated: 'Deoxygenated blood flow',
    mixed: 'Blood separation / chamber lining',
    electrical: 'Electrical conduction pathway',
    structural: 'Valve support / cardiac structure'
  };
  return labels[type] || 'Cardiac anatomy';
}

function getFlowColor(type) {
  const colors = {
    oxygenated: [1.0, 0.18, 0.32, 1.0],
    deoxygenated: [0.0, 0.5, 1.0, 1.0],
    electrical: [0.0, 1.0, 0.84, 1.0],
    structural: [1.0, 0.8, 0.0, 1.0],
    mixed: [0.74, 0.53, 1.0, 1.0]
  };
  return colors[type] || colors.structural;
}

function getPickPoint(picked) {
  const screenSources = [
    picked && picked.position2D,
    picked && picked.canvasPosition,
    picked && picked.screenPosition,
    picked && picked.mousePosition,
    picked && picked.canvasCoord,
    picked && typeof picked.clientX === 'number' ? { x: picked.clientX, y: picked.clientY } : null
  ].filter(Boolean);
  const screen = screenSources.find(value => typeof value.x === 'number' || Array.isArray(value));
  const worldSources = [
    picked && picked.position3D,
    picked && picked.worldPosition,
    picked && picked.intersection,
    picked && picked.point,
    picked && picked.position
  ].filter(Boolean);
  const world = worldSources.find(value => typeof value.x === 'number' || Array.isArray(value));

  return {
    screen: screen ? normalizeScreenPoint(screen) : { ...latestPointer },
    world: world ? normalizePoint(world) : null
  };
}

function normalizePoint(value) {
  if (Array.isArray(value)) return { x: value[0], y: value[1], z: value[2] };
  return { x: value.x, y: value.y, z: value.z };
}

function normalizeScreenPoint(value) {
  const point = normalizePoint(value);
  if (point.x <= 1 && point.y <= 1) {
    return { x: point.x * window.innerWidth, y: point.y * window.innerHeight };
  }
  return point;
}

function clampScreenPoint(point) {
  const leftPanel = document.getElementById('leftPanel');
  const rightPanel = document.getElementById('rightPanel');
  const leftPanelVisible = leftPanel && getComputedStyle(leftPanel).display !== 'none';
  const rightPanelVisible = rightPanel && getComputedStyle(rightPanel).display !== 'none';
  const minX = leftPanelVisible ? leftPanel.getBoundingClientRect().right + 28 : 26;
  const maxX = rightPanelVisible ? rightPanel.getBoundingClientRect().left - 300 : window.innerWidth - 330;
  const minY = 88;
  const maxY = window.innerHeight - 250;
  return {
    x: Math.min(Math.max(point.x || latestPointer.x, minX), Math.max(minX, maxX)),
    y: Math.min(Math.max(point.y || latestPointer.y, minY), Math.max(minY, maxY))
  };
}

function showAnatomyEffects(data, meta, source) {
  if (!flowOverlay) return;

  document.body.dataset.flowType = meta.flowType;
  document.body.style.setProperty('--beat-ms', `${(60 / heartRateBPM) * 1000}ms`);
  if (api && api.setHighlightOptions) {
    const color = getFlowColor(meta.flowType);
    api.setHighlightOptions({
      outlineWidth: 7,
      outlineColor: color,
      outlineDuration: 0.25,
      highlightColor: color,
      highlightDuration: 0.25
    });
  }

  flowOverlay.className = `flow-overlay ${meta.flowType}`;
  flowOverlay.querySelector('.flow-title').textContent = getFlowLabel(meta.flowType);
  flowOverlay.querySelector('.flow-steps').innerHTML = meta.path.map(step => `<span>${step}</span>`).join('');

  if (source && source.includes('list')) {
    if (hoverCallout) hoverCallout.classList.add('hidden');
    if (hoverTooltip) hoverTooltip.classList.add('hidden');
    stopHoverFollow();
    latestPointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.48 };
    positionHoverEffects();
  }
}

function positionHoverEffects() {
  if (!activeHover || !hoverCallout || !hoverTooltip) return;
  const { x, y } = clampScreenPoint(activeHover.screen || latestPointer);
  const leftSide = x > window.innerWidth * 0.55;

  hoverCallout.classList.toggle('left-facing', leftSide);
  hoverTooltip.classList.toggle('left-facing', leftSide);
  hoverCallout.style.left = `${x}px`;
  hoverCallout.style.top = `${y}px`;
  const maxTooltipX = Math.max(18, window.innerWidth - 338);
  const maxTooltipY = Math.max(88, window.innerHeight - 238);
  hoverTooltip.style.left = `${Math.min(Math.max(x + (leftSide ? -330 : 92), 18), maxTooltipX)}px`;
  hoverTooltip.style.top = `${Math.min(Math.max(y - 44, 88), maxTooltipY)}px`;
}

function startHoverFollow() {
  if (hoverFrame) return;
  const tick = () => {
    if (!activeHover) {
      hoverFrame = null;
      return;
    }
    if (activeHover.world && api && api.getWorldToScreenCoordinates) {
      api.getWorldToScreenCoordinates(
        [activeHover.world.x, activeHover.world.y, activeHover.world.z],
        function(err, screen) {
          if (!err && screen) activeHover.screen = normalizeScreenPoint(screen);
          positionHoverEffects();
        }
      );
    } else {
      activeHover.screen = { ...latestPointer };
      positionHoverEffects();
    }
    hoverFrame = requestAnimationFrame(tick);
  };
  hoverFrame = requestAnimationFrame(tick);
}

function stopHoverFollow() {
  activeHover = null;
  if (hoverFrame) {
    cancelAnimationFrame(hoverFrame);
    hoverFrame = null;
  }
}

function showSceneHover(data, meta, pickPoint) {
  if (!hoverCallout || !hoverTooltip) return;
  activeHover = {
    data,
    meta,
    screen: pickPoint.screen,
    world: pickPoint.world
  };

  hoverCallout.className = `anatomy-callout in-model-callout ${meta.flowType}`;
  hoverCallout.querySelector('.callout-name').textContent = data.name;
  hoverTooltip.className = `hover-tooltip in-model-tooltip ${meta.flowType}`;
  hoverTooltip.innerHTML = `
    <div class="hover-tooltip-title" style="color:${data.color || '#00ffd5'}">${data.name}</div>
    <p>${data.desc}</p>
    <div><strong>Function</strong><span>${data.fn}</span></div>
    <div><strong>Blood Flow</strong><span>${data.blood}</span></div>
  `;
  positionHoverEffects();
  startHoverFollow();
}

function hideSceneHoverEffects() {
  if (hoverCallout) hoverCallout.classList.add('hidden');
  if (hoverTooltip) hoverTooltip.classList.add('hidden');
  if (flowOverlay) flowOverlay.classList.add('hidden');
  stopHoverFollow();
  if (api && api.unhighlightMaterial) api.unhighlightMaterial();
}

function setupHoverInteractions() {
  if (!api) return;

  if (api.setHighlightOptions) {
    api.setHighlightOptions({
      outlineWidth: 6,
      outlineColor: [0.0, 1.0, 0.84, 1.0],
      outlineDuration: 0.35,
      highlightColor: [1.0, 0.2, 0.34, 1.0],
      highlightDuration: 0.35
    });
  }

  if (api.getNodeMap) {
    api.getNodeMap(function(err, nodes) {
      if (err || !nodes) return;
      Object.values(nodes).forEach(node => {
        const id = resolveAnatomyId(node);
        if (id && node.instanceID) anatomyNodeCache.set(node.instanceID, id);
      });
    });
  }

  api.addEventListener('nodeMouseEnter', function(node) {
    clearTimeout(hoverHideTimer);
    const id = resolveAnatomyId(node) || anatomyNodeCache.get(node.instanceID);
    const pickPoint = getPickPoint(node);

    latestPointer = pickPoint.screen;
    showInfo(id || 'generic', { source: 'viewer-hover' });
    positionHoverEffects();
    highlightPickedMaterial(node);
  }, { pick: 'slow' });

  api.addEventListener('nodeMouseLeave', function() {
    clearTimeout(hoverHideTimer);
    hoverHideTimer = setTimeout(hideSceneHoverEffects, 140);
  }, { pick: 'fast' });

  api.addEventListener('click', function(info) {
    const id = resolveAnatomyId(info) || anatomyNodeCache.get(info.instanceID);
    if (id) {
      const pickPoint = getPickPoint(info);
      latestPointer = pickPoint.screen;
      showInfo(id, { source: 'viewer-click' });
      positionHoverEffects();
    }
    if (info && info.material) highlightPickedMaterial(info);
  }, { pick: 'slow' });
}

function resolveAnatomyId(picked) {
  if (!picked) return null;
  const material = picked.material || {};
  const searchable = [
    picked.name,
    picked.displayName,
    picked.type,
    picked.path,
    material.name,
    material.uid,
    material.id
  ].filter(Boolean).join(' ').toLowerCase();

  if (!searchable) return null;
  const normalized = ` ${searchable.replace(/[_-]+/g, ' ')} `;
  const match = HOVER_MATCHERS.find(rule => rule.terms.some(term => {
    const value = term.toLowerCase();
    return normalized.includes(` ${value} `) || normalized.includes(value);
  }));

  return match ? match.id : null;
}

function highlightPickedMaterial(picked) {
  if (!api || !api.highlightMaterial || !picked || !picked.material) return;
  api.highlightMaterial(picked.material);
}

// ============================================================
//  HEARTBEAT ANIMATION
// ============================================================
function startHeartbeat() {
  if (beatInterval) clearInterval(beatInterval);
  const ms = (60 / heartRateBPM) * 1000;
  beatInterval = setInterval(() => {
    document.querySelector('.brand-icon').classList.add('beat-flash');
    setTimeout(() => document.querySelector('.brand-icon').classList.remove('beat-flash'), 300);
  }, ms);
}

// ============================================================
//  UI BINDINGS
// ============================================================
(function bindUI() {
  const sl = document.getElementById('bpmSlider');
  const bn = document.getElementById('bpmNumber');
  const bl = document.getElementById('bpmLabel');

  sl.addEventListener('input', e => {
    heartRateBPM = +e.target.value;
    bn.textContent = heartRateBPM;
    bl.innerHTML = heartRateBPM < 60 ? 'Bradycardia' : heartRateBPM > 100 ? 'Tachycardia<br/>(Fast)' : 'Normal<br/>(Sinus Rhythm)';
    startHeartbeat();
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    if (api && api.setSpeed) {
      api.setSpeed(heartRateBPM > 100 ? 2 : heartRateBPM < 60 ? 0.5 : 1);
    }
  });

  document.querySelectorAll('.preset-btn').forEach(b => b.addEventListener('click', () => {
    heartRateBPM = +b.dataset.bpm;
    sl.value = heartRateBPM;
    bn.textContent = heartRateBPM;
    bl.innerHTML = heartRateBPM < 60 ? 'Bradycardia' : heartRateBPM > 100 ? 'Tachycardia' : 'Normal<br/>(Sinus Rhythm)';
    startHeartbeat();
    document.querySelectorAll('.preset-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  }));

  // Disease
  document.querySelectorAll('.disease-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.disease-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    diseaseMode = btn.dataset.disease;
    const info = document.getElementById('diseaseInfo');
    if (diseaseMode === 'blocked') { heartRateBPM = 90; sl.value = 90; bn.textContent = 90; info.textContent = '🚫 Simulating coronary artery blockage. In real patients, ST-elevation on ECG and chest pain occur.'; }
    else if (diseaseMode === 'valve') { info.textContent = '⚠️ Simulating mitral valve regurgitation. Blood leaks backward during systole, reducing cardiac output.'; }
    else if (diseaseMode === 'arrhythmia') { heartRateBPM = 130; sl.value = 130; bn.textContent = 130; info.textContent = '💔 Simulating atrial fibrillation. Irregular, rapid heartbeat with loss of organized atrial contraction.'; }
    else { heartRateBPM = 72; sl.value = 72; bn.textContent = 72; info.textContent = ''; }
    startHeartbeat();
  }));

  // Guided Tour
  let gStep = 0;
  const gOver = document.getElementById('guidedOverlay');
  function showGStep(i) {
    gStep = Math.max(0, Math.min(i, GUIDED_STEPS.length - 1));
    const s = GUIDED_STEPS[gStep];
    document.getElementById('guidedTitle').textContent = s.title;
    document.getElementById('guidedText').textContent = s.text;
    document.getElementById('guidedStepNum').textContent = gStep + 1;
    document.getElementById('guidedStepTotal').textContent = GUIDED_STEPS.length;
  }
  document.getElementById('btnGuidedTour').addEventListener('click', () => { gOver.classList.remove('hidden'); showGStep(0); });
  document.getElementById('guidedClose').addEventListener('click', () => gOver.classList.add('hidden'));
  document.getElementById('guidedPrev').addEventListener('click', () => showGStep(gStep - 1));
  document.getElementById('guidedNext').addEventListener('click', () => showGStep(gStep + 1));

  // Quiz
  let qIdx = 0, qScore = 0;
  const qOver = document.getElementById('quizOverlay');
  function showQ(i) {
    qIdx = i;
    if (i >= QUIZ.length) {
      document.getElementById('quizQuestion').textContent = `🎉 Quiz Complete! Score: ${qScore}/${QUIZ.length}`;
      document.getElementById('quizOptions').innerHTML = qScore === QUIZ.length ? '<p style="color:#00ff88">Perfect score! You\'re a cardiology expert!</p>' : '<p>Review the structures you missed using the Guided Tour.</p>';
      document.getElementById('quizFeedback').classList.add('hidden');
      document.getElementById('quizNext').classList.add('hidden');
      return;
    }
    const q = QUIZ[i];
    document.getElementById('quizQuestion').textContent = `Q${i + 1}. ${q.q}`;
    document.getElementById('quizOptions').innerHTML = q.opts.map((o, j) => `<button class="quiz-opt" data-idx="${j}">${o}</button>`).join('');
    document.getElementById('quizFeedback').classList.add('hidden');
    document.getElementById('quizNext').classList.add('hidden');
    document.getElementById('quizScore').textContent = qScore;
    document.getElementById('quizTotal').textContent = QUIZ.length;
    document.querySelectorAll('.quiz-opt').forEach(b => b.addEventListener('click', () => {
      const idx = +b.dataset.idx, correct = idx === q.ans;
      if (correct) { qScore++; b.classList.add('correct'); } else { b.classList.add('wrong'); document.querySelectorAll('.quiz-opt')[q.ans].classList.add('correct'); }
      document.querySelectorAll('.quiz-opt').forEach(x => x.disabled = true);
      const fb = document.getElementById('quizFeedback');
      fb.textContent = correct ? `✅ Correct! ${q.explain}` : `❌ Incorrect. ${q.explain}`;
      fb.className = `quiz-feedback ${correct ? 'correct-fb' : 'wrong-fb'}`;
      document.getElementById('quizNext').classList.remove('hidden');
      document.getElementById('quizScore').textContent = qScore;
    }));
  }
  document.getElementById('btnQuizMode').addEventListener('click', () => { qOver.classList.remove('hidden'); qScore = 0; showQ(0); });
  document.getElementById('quizClose').addEventListener('click', () => qOver.classList.add('hidden'));
  document.getElementById('quizNext').addEventListener('click', () => showQ(qIdx + 1));
})();

// ============================================================
//  START
// ============================================================
window.addEventListener('DOMContentLoaded', initViewer);
