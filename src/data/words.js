export const WORD_BANKS = {
  short: [
    'ace','act','add','age','aid','aim','air','and','ant','arc','arm','ash','ask','bad','bag','bar','bat','bay','bee','bet',
    'bin','bit','box','boy','bus','cab','can','cap','cat','cod','cow','cub','cup','cut','day','den','dew','dig','dim','dog',
    'dot','dry','ear','eat','eel','egg','elf','elk','end','era','fan','far','fat','fed','fig','fin','fit','fix','fog','fox',
    'fun','gap','gas','gem','get','gig','gum','gut','ham','hat','hen','hit','hop','hot','ice','ink','jam','jar','jet','joy',
    'key','kit','lab','lap','law','leg','lid','log','map','mix','net','nod','oak','orb','owl','pan','pen','pet','pin','pop',
    'ram','ray','red','rim','row','run','sap','sip','sky','son','sun','tag','tan','tap','top','van','web','win','zip'
  ],
  common: [
    'able','acid','ally','also','area','army','atom','axis','bank','base','beam','belt','bend','bird','blast','blink','block',
    'bolt','boom','brave','brick','bring','burst','cable','cargo','chain','chart','chase','clean','clear','climb','clock',
    'cloud','coast','comet','crane','crisp','crush','delta','dream','drift','eagle','early','ember','entry','field','final',
    'flame','flare','flash','fleet','focus','forge','frame','front','frost','giant','glide','glow','grace','grade','grain',
    'green','guard','happy','harbor','haste','hazel','heart','hover','ideal','image','index','inner','ivory','laser','level',
    'light','logic','lucky','lunar','magic','major','metal','meter','mighty','minor','model','night','noble','north','novel',
    'oasis','ocean','orbit','panel','panic','pilot','pixel','plain','plant','plume','point','power','prime','prism','pulse',
    'quick','quiet','radar','rapid','raven','react','relay','rider','river','robot','rocket','rough','round','royal','scale',
    'scope','score','sharp','shift','shine','shock','short','skill','sling','smart','solar','sound','spark','speed','spike',
    'spire','stack','stage','stark','steel','storm','surge','swift','sword','table','tempo','thing','tiger','tower','trace',
    'trail','turbo','ultra','unity','valor','vapor','vector','vivid','voice','waver','whirl','world','young','zesty'
  ],
  medium: [
    'anchor','arcade','binary','blazer','border','bridge','bright','canyon','carbon','caster','cipher','cobalt','comedy',
    'cosmic','danger','dragon','engine','factor','falcon','fierce','forest','fusion','galaxy','garden','glitch','golden',
    'hammer','hazard','helmet','impact','jacket','jungle','kernel','launch','legend','matrix','meteor','motion','nebula',
    'object','orange','packet','planet','plasma','pocket','puzzle','quartz','random','ranger','rescue','rocket','runner',
    'sensor','signal','silver','single','socket','spirit','stable','static','stream','strike','switch','target','temple',
    'thrill','thrust','travel','tunnel','vector','vertex','victor','vision','wander','window','winner','wizard','wonder',
    'zephyr','archive','battery','captain','crystal','diamond','eclipse','factory','gateway','gravity','horizon','justice',
    'lantern','machine','network','phantom','quantum','scanner','texture','upgrade','venture','warrior','wildfire','xenial'
  ],
  long: [
    'airborne','asteroid','backspin','blueprint','boundary','brilliant','calculate','cardinal','celestial','challenge',
    'champion','civilian','collector','critical','defender','delivery','dynamite','electric','electron','firestorm',
    'frontier','guardian','headline','hyperion','infinite','junction','keystone','landmark','magnetic','marathon',
    'midnight','momentum','navigator','nightfall','operator','overdrive','particle','pressure','reaction','resonant',
    'sapphire','sentinel','skylight','solution','starship','strategy','sunburst','terminal','triangle','velocity',
    'wildcard','windfall','workshop','zeppelin','afterglow','blackout','crossfire','daybreak','downshift','gearshift',
    'moonlight','powerline','rainstorm','snowfall','spectrum','starlight','turntable','vanguard','waveform','yardstick',
    'framework','greenline','locksmith','prototype','shipyard','tailwind','threshold','turbulent','undertone','waterline'
  ],
  boss: [
    'acceleration','atmospheric','battlecruiser','breakthrough','catastrophe','constellation','counterforce','cybernetic',
    'decompression','disruptor','electromancer','firebreaker','gravitywell','hyperactive','interceptor','kinetoscope',
    'lightningrod','magnificent','metropolitan','microfusion','navigation','nightstalker','overclocked','photosphere',
    'quasarstorm','radiowave','recalibrate','singularity','starbreaker','subterranean','teleporter','transmission',
    'ultraviolet','vaportrail','vectorfield','watchtower','xenogenesis','yellowhammer','zenithpoint','zerogravity'
  ]
};

export const ALL_WORDS = Object.values(WORD_BANKS).flat();
