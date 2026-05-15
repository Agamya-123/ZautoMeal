'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ShowcasePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [schedule, setSchedule] = useState({ 
    frequency: 'Daily', 
    time: '19:00', 
    startDate: new Date().toISOString().split('T')[0],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    selectedWeeks: ['All Weeks'],
    monthDate: 1,
    priority: 'Normal',
    channel: 'App Push',
    paymentMethod: 'UPI',
    automationPreference: 'AUTO_EXECUTE'
  });
  const [testState, setTestState] = useState<any>({ logs: [], current_os: 'IDLE', isRunning: false, no_response_preference: 'AUTO_EXECUTE' });
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const lastAnsweredLogRef = useRef<string>("");
  const ignoredStateRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isTabVisible = useRef(true);

  const categories = [
    { id: 'meals', name: 'Meal Automation', color: '#FC8019', tag: 'Vertical M' },
    { id: 'groceries', name: 'Grocery Cycles', color: '#00E676', tag: 'Vertical G' },
    { id: 'pharmacy', name: 'Pharmacy Health', color: '#2196F3', tag: 'Vertical P' }
  ];

  const productStock: Record<string, any[]> = {
    meals: [
      { id: 'm1', name: 'Premium Butter Chicken Bento', price: '₹349', desc: 'Freshly prepared hot meal bento box.' },
      { id: 'm2', name: 'Paneer Tikka Fusion Platter', price: '₹299', desc: 'Grilled paneer with herbed rice.' },
      { id: 'm3', name: 'Artisan Chicken Burger Meal', price: '₹399', desc: 'Double patty with truffle fries.' },
      { id: 'm4', name: 'Quinoa & Avocado Power Bowl', price: '₹320', desc: 'Protein-rich healthy vegan meal.' },
      { id: 'm5', name: 'Grilled Atlantic Salmon', price: '₹549', desc: 'Wild-caught salmon with steamed greens.' },
      { id: 'm6', name: 'Mediterranean Veggie Wrap', price: '₹249', desc: 'Hummus, feta, and grilled vegetables.' },
      { id: 'm7', name: 'Classic Caesar Salad', price: '₹279', desc: 'With grilled tofu and house dressing.' }
    ],
    groceries: [
      { id: 'g1', name: 'Organic A2 Milk (1L)', price: '₹120', desc: 'Farm-fresh organic dairy.' },
      { id: 'g2', name: 'Sourdough Bread Loaf', price: '₹180', desc: 'Naturally leavened artisan bread.' },
      { id: 'g3', name: 'Farm Fresh Eggs (6pk)', price: '₹95', desc: 'Protein-packed cage-free eggs.' },
      { id: 'g4', name: 'Aged Basmati Rice (5kg)', price: '₹750', desc: 'Premium long-grain selection.' },
      { id: 'g5', name: 'Cold Pressed Coconut Oil', price: '₹450', desc: 'Pure extracted health oil.' },
      { id: 'g6', name: 'Premium Arabica Coffee Beans', price: '₹890', desc: 'Dark roast, single-origin beans.' },
      { id: 'g7', name: 'Organic Hass Avocados (3pk)', price: '₹350', desc: 'Ready-to-eat buttery avocados.' },
      { id: 'g8', name: 'Himalayan Pink Salt (500g)', price: '₹140', desc: 'Unrefined natural mineral salt.' }
    ],
    pharmacy: [
      { id: 'p1', name: 'Insulin Glargine (10ml)', price: '₹850', desc: 'Critical medication (2-8°C).' },
      { id: 'p2', name: 'Advanced BP Monitor', price: '₹2450', desc: 'Digital upper-arm pressure sensor.' },
      { id: 'p3', name: 'Comprehensive First Aid Kit', price: '₹1200', desc: 'Emergency response medical supplies.' },
      { id: 'p4', name: 'Multivitamin Supplement (60ct)', price: '₹950', desc: 'Daily essential nutrient boost.' },
      { id: 'p5', name: 'Digital Pulse Oximeter', price: '₹1490', desc: 'Oxygen saturation and heart rate monitor.' },
      { id: 'p6', name: 'N95 Respirator Mask (10pk)', price: '₹550', desc: 'High-filtration protective masks.' },
      { id: 'p7', name: 'Antiseptic Solution (500ml)', price: '₹180', desc: 'Medical-grade disinfectant solution.' }
    ]
  };

  useEffect(() => {
    const handleVisibility = () => { isTabVisible.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (activeStep !== 3) return;

    const poll = async () => {
      if (!isTabVisible.current) return;
      try {
        const res = await fetch('/api/test/atros-v3');
        if (res.ok) {
          const data = await res.json();
          setTestState(data);
          if (!data.isRunning) setShowPopup(null);
          else {
            const logs = data.logs || [];
            const latestLog = logs[logs.length - 1] || "";
            let targetPopup: string | null = null;
            if (data.current_os === 'SUBSTITUTE_FOUND') targetPopup = 'SUB_NOTIF';
            else if (data.current_os === 'PARTIAL_ORDER_OPTION') targetPopup = 'NO_SUB_NOTIF';
            else if (data.current_os === 'CONFIRMATION_PENDING') targetPopup = 'T60_NOTIF';
            else if (data.current_os === 'T30_CONFIRMATION_PENDING') targetPopup = 'T30_NOTIF';
            else if (data.current_os === 'PAYMENT_APPROVAL_REQUIRED') targetPopup = 'PAY_NOTIF';
            
            // Clear ignore if state changed
            if (data.current_os !== ignoredStateRef.current) {
              ignoredStateRef.current = null;
            }

            if (targetPopup && data.current_os !== ignoredStateRef.current && latestLog !== lastAnsweredLogRef.current) {
              setShowPopup(targetPopup);
            } else {
              setShowPopup(null);
            }
          }
        }
      } catch (e) {}
    };

    const intervalTime = testState.isRunning ? 800 : 3000;
    const interval = setInterval(poll, intervalTime);
    return () => clearInterval(interval);
  }, [activeStep, testState.isRunning]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [testState.logs]);

  const selectCategory = (catId: string | null) => {
    if (catId !== selectedCategory) {
      setCart([]);
      setSearchQuery("");
    }
    setSelectedCategory(catId);
  };

  useEffect(() => {
    if (cart.length === 0 && showScheduleDrawer) {
      setShowScheduleDrawer(false);
      setIsScheduling(false);
    }
  }, [cart, showScheduleDrawer]);

  const handleFrequencyChange = (f: string) => {
    let newDays = schedule.days;
    if (f === 'Daily' || f === 'Weekly') {
      newDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } 
    setSchedule({...schedule, frequency: f, days: newDays});
  };

  const handleInitialize = () => {
    if (schedule.paymentMethod === 'Cash on Delivery' || schedule.paymentMethod === 'Cash') {
      startSimulation();
    } else {
      setShowConfirmation(true);
    }
  };

  const startSimulation = async () => {
    setShowScheduleDrawer(false);
    setShowConfirmation(false);
    
    if (!isScheduling) {
      setShowSuccess(true);
      setTimeout(() => {
        setCart([]);
        setSelectedCategory(null);
        setShowSuccess(false);
        setActiveStep(1);
      }, 2500);
      return;
    }

    const totalAmount = cart.reduce((acc, i) => acc + (parseInt(i.price.replace('₹', '')) * i.quantity), 0);
    lastAnsweredLogRef.current = "";
    setTestState({ logs: [], current_os: 'IDLE', isRunning: true, no_response_preference: schedule.automationPreference });
    await fetch('/api/test/atros-v3', { method: 'POST', body: JSON.stringify({ action: 'RESET' }) });
    const productList = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const typeMap: Record<string, string> = { meals: 'MEAL', groceries: 'GROCERY', pharmacy: 'PHARMACY' };
    const finalType = typeMap[selectedCategory || 'meals'] || 'MEAL';

    const res = await fetch('/api/test/atros-v3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'RUN_PIPELINE', 
          rio: { 
            automation_id: `PATENT-MULTI-${cart.length}`, 
            products: productList, 
            schedule: { ...schedule, type: finalType, totalAmount: totalAmount } 
          } 
        })
      });
    setActiveStep(3);
  };

  const inject = (action: string, value: any) => {
    const currentLatest = testState.logs[testState.logs.length - 1] || "";
    lastAnsweredLogRef.current = currentLatest;
    fetch('/api/test/atros-v3', { method: 'POST', body: JSON.stringify({ action, value }) });
    setShowPopup(null);
  };

  const handleNoResponse = () => {
    const currentLatest = testState.logs[testState.logs.length - 1] || "";
    lastAnsweredLogRef.current = currentLatest;
    ignoredStateRef.current = testState.current_os; // Stickily ignore this state
    setShowPopup(null);
  };

  const toggleDay = (day: string) => {
    const newDays = schedule.days.includes(day) ? schedule.days.filter(d => d !== day) : [...schedule.days, day];
    setSchedule({...schedule, days: newDays});
  };

  const toggleWeek = (week: string) => {
    let newWeeks = [...schedule.selectedWeeks];
    if (week === 'All Weeks') {
      newWeeks = ['All Weeks'];
    } else {
      newWeeks = newWeeks.filter(w => w !== 'All Weeks');
      if (newWeeks.includes(week)) {
        newWeeks = newWeeks.filter(w => w !== week);
      } else {
        newWeeks.push(week);
      }
      if (newWeeks.length === 0) newWeeks = ['All Weeks'];
    }
    setSchedule({...schedule, selectedWeeks: newWeeks});
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty < 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, quantity: newQty } : i);
    });
  };

  const toggleCart = (product: any) => {
    if (cart.some(i => i.id === product.id)) {
      setCart(cart.filter(i => i.id !== product.id));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const filteredProducts = selectedCategory ? productStock[selectedCategory].filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  const getProgress = () => {
    const os = testState.current_os;
    if (os === 'COMPLETED') return 100;
    if (os === 'DELIVERED') return 90;
    if (os === 'OUT_FOR_DELIVERY') return 75;
    if (os === 'WAREHOUSE_NOTIFIED') return 50;
    if (os === 'CREATED') return 25;
    return 10;
  };

  return (
    <div style={{ background: '#020202', color: '#FFF', fontFamily: '"Inter", sans-serif', minHeight: '100vh', padding: activeStep === 3 ? '20px 5%' : '60px 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* --- HEADER (Hidden in Step 3) --- */}
        {activeStep !== 3 && (
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>Smart Recurring Order and Inventory Optimization Platform</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500 }}>Schedule recurring purchase, reserve inventory in advance and confirm your order with a single tap</p>
          </div>
        )}

        {/* --- STEP PROGRESS (Hidden in Step 3) --- */}
        {activeStep !== 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 80 }}>
            {[1, 3].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: activeStep === s ? 1 : 0.2, transition: '0.5s ease' }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${activeStep >= s ? '#FC8019' : 'rgba(255,255,255,0.15)'}`, color: activeStep >= s ? '#FC8019' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>0{s === 1 ? 1 : 2}</div>
                <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s === 1 ? 'Bundle Discovery' : 'State Simulation'}</span>
              </div>
            ))}
          </div>
        )}

        {/* --- STEP 1: DISCOVERY --- */}
        {activeStep === 1 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            {!selectedCategory ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {categories.map(cat => (
                  <div key={cat.id} onClick={() => selectCategory(cat.id)} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 50, cursor: 'pointer', transition: '0.3s', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: cat.color, marginBottom: 20, letterSpacing: '0.1em' }}>{cat.tag}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{cat.name}</h3>
                    <div style={{ height: 1, width: 40, background: 'rgba(255,255,255,0.1)', margin: '20px auto' }} />
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 900, textTransform: 'uppercase' }}>Initialize Module</div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 24 }}>
                  <button onClick={() => selectCategory(null)} style={{ background: 'rgba(255,255,255,0.03)', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '12px 24px', borderRadius: 8, fontSize: 10, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}>BACK TO MODULES</button>
                  <input type="text" placeholder={`Search Category ${selectedCategory.toUpperCase()}...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#FFF', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }} />
                  <div style={{ minWidth: 100, textAlign: 'right' }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: '#FC8019', display: 'block', letterSpacing: '0.1em' }}>BUNDLE TOTAL</span>
                    <span style={{ fontSize: 20, fontWeight: 900 }}>{cartTotalItems}</span>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 120 }}>
                  {filteredProducts.map(p => {
                    const cartItem = cart.find(i => i.id === p.id);
                    const inCart = !!cartItem;
                    return (
                      <div key={p.id} style={{ background: 'rgba(255,255,255,0.01)', border: inCart ? '1px solid #FC8019' : '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 32, position: 'relative' }}>
                        <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.2)', marginBottom: 8 }}>#{p.id.toUpperCase()}</div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{p.name}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.5, marginBottom: 24, height: 40 }}>{p.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 18, fontWeight: 900 }}>{p.price}</span>
                          {inCart ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(252,128,25,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid #FC801933' }}>
                              <button onClick={() => updateQuantity(p.id, -1)} style={{ background: 'none', border: 'none', color: '#FC8019', fontWeight: 900, cursor: 'pointer', padding: '4px 8px' }}>−</button>
                              <span style={{ fontSize: 12, fontWeight: 900, color: '#FFF', minWidth: 20, textAlign: 'center' }}>{cartItem.quantity}</span>
                              <button onClick={() => updateQuantity(p.id, 1)} style={{ background: 'none', border: 'none', color: '#FC8019', fontWeight: 900, cursor: 'pointer', padding: '4px 8px' }}>+</button>
                            </div>
                          ) : (
                            <button onClick={() => toggleCart(p)} style={{ padding: '10px 18px', borderRadius: 8, background: 'rgba(252,128,25,0.1)', color: '#FC8019', border: '1px solid #FC801955', fontSize: 10, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.05em' }}>ADD TO BUNDLE</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {cart.length > 0 && (
                  <div style={{ 
                    position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', 
                    width: '94%', maxWidth: 1000, background: '#0A0A0A', 
                    border: '1px solid #FC801944', borderRadius: 20, 
                    padding: '20px 32px', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', zIndex: 100,
                    gap: 20
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.1em' }}>ACTIVE BUNDLE MANIFEST</div>
                      <div style={{ 
                        fontSize: 12, fontWeight: 800, color: '#FFF', 
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                      }}>
                        {cart.map(i => `${i.quantity}x ${i.name}`).join(' | ')}
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowScheduleDrawer(true)} 
                      style={{ 
                        padding: '16px 24px', borderRadius: 10, background: '#FC8019', 
                        color: '#FFF', border: 'none', fontWeight: 900, fontSize: 11, 
                        cursor: 'pointer', letterSpacing: '0.05em', flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      PROCEED TO CHECKOUT
                    </button>
                  </div>
                )}

              </>
            )}
          </div>
        )}

        {/* --- STEP 3: SIMULATION --- */}
        {activeStep === 3 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 32px' }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.25)', marginBottom: 20, letterSpacing: '0.1em' }}>PROVIDER BACKEND INTERFACE</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, gridAutoRows: '1fr', alignItems: 'stretch' }}>
                    <ControlBox label="Inventory Check" active={testState.current_os === 'CREATED'} onYes={() => inject('injectedInventory', 'available')} onNo={() => inject('injectedInventory', 'out')} yesLabel="VERIFIED" noLabel="OOS" />
                    <ControlBox label="Warehouse Procure" active={testState.current_os === 'WAREHOUSE_NOTIFIED'} onYes={() => inject('injectedProcurement', 'yes')} onNo={() => inject('injectedProcurement', 'no')} yesLabel="RESOLVED" noLabel="FAILED" />
                    <ControlBox label="Substitution Logic" active={testState.logs.some((l:any) => l.includes('SUBSTITUTION_ENGINE'))} onYes={() => inject('injectedSubFound', true)} onNo={() => inject('injectedSubFound', false)} yesLabel="FOUND" noLabel="NONE" />
                    
                    {schedule.paymentMethod === 'Cash on Delivery' || schedule.paymentMethod === 'Cash' ? (
                      <div style={{ background: 'rgba(0,230,118,0.03)', padding: '20px', borderRadius: 12, border: '1px solid rgba(0,230,118,0.1)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: 110 }}>
                        <div style={{ fontSize: 8, fontWeight: 900, color: '#00E676', marginBottom: 4, letterSpacing: '0.1em' }}>COD AUTO RESOLVE</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>BYPASS ACTIVE</div>
                      </div>
                    ) : (
                      <ControlBox label="Payment Handshake" active={testState.current_os === 'PAYMENT_PENDING'} onYes={() => inject('injectedPayment', 'primary_ok')} onNo={() => inject('injectedPayment', 'failed')} yesLabel="VERIFIED" noLabel="FAILED" />
                    )}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 16, padding: '20px 32px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 900, color: '#FC8019', marginBottom: 8, letterSpacing: '0.1em' }}>BUNDLE MANIFEST</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#FFF' }}>{cart.map(i => `${i.quantity}x ${i.name}`).join(' | ')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 900, color: '#FC8019', marginBottom: 8, letterSpacing: '0.1em' }}>PAYMENT PROTOCOL</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#FFF' }}>{schedule.paymentMethod}</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#080808', padding: '24px 32px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>LIFECYCLE PROGRESS</span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#FC8019' }}>{getProgress()}%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ width: `${getProgress()}%`, height: '100%', background: '#FC8019', borderRadius: 2, transition: '1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px 32px', display: 'flex', flexDirection: 'column', height: 600 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>EXECUTION CONSOLE</div>
                  <div style={{ fontSize: 9, color: '#00E676', fontWeight: 900 }}>SYSTEM ONLINE</div>
                </div>
                <div ref={scrollRef} style={{ height: 450, overflowY: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, lineHeight: 1.8 }}>
                  {testState.logs.map((log: string, i: number) => {
                    const type = log.match(/\[(.*?)\]/)?.[1] || 'INFO';
                    const isLast = i === testState.logs.length - 1;
                    const color = type === 'SUCCESS' ? '#00E676' : type === 'WARN' ? '#FFD700' : type === 'FATAL' || type === 'CRITICAL' ? '#FF3B30' : type === 'SYSTEM' ? '#FC8019' : type === 'STATUS' ? '#87CEFF' : '#FFFFFF';
                    return <div key={i} style={{ color, opacity: isLast ? 1 : 0.85, fontWeight: isLast ? 700 : 400 }}>{log}</div>;
                  })}
                  {testState.isRunning && (testState.current_os === 'PAYMENT_PENDING' || testState.current_os === 'CONFIRMATION_PENDING' || testState.current_os === 'T30_CONFIRMATION_PENDING') && <div style={{ color: '#FC8019', marginTop: 10, animation: 'pulse 1s infinite', fontWeight: 700 }}>{`> AWAITING USER INTERACTION...`}</div>}
                </div>
                {!testState.isRunning && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                    <button onClick={() => { setActiveStep(1); setSelectedCategory(null); setCart([]); setTestState({ logs: [], current_os: 'IDLE', isRunning: false }); setIsScheduling(false); }} style={{ padding: '14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, fontSize: 10, cursor: 'pointer', letterSpacing: '0.1em' }}>RESTART SYSTEM</button>
                    <button onClick={() => router.push('/dashboard/billing')} style={{ padding: '14px', borderRadius: 8, background: '#FC8019', color: '#FFF', border: 'none', fontWeight: 900, fontSize: 10, cursor: 'pointer', letterSpacing: '0.1em' }}>VIEW IN BILLING</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SCHEDULE OVERLAY DRAWER --- */}
        {showScheduleDrawer && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 500, height: '100%', background: '#080808', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '40px', overflowY: 'auto', animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900 }}>Checkout Summary</h2>
                <button onClick={() => setShowScheduleDrawer(false)} style={{ background: 'none', border: 'none', color: '#FC8019', fontSize: 10, fontWeight: 900, cursor: 'pointer' }}>CLOSE</button>
              </div>

              {/* --- SECTION 1: CART REVIEW --- */}
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, marginBottom: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={labelStyle}>Order Manifest</label>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{item.price}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: 900, cursor: 'pointer', fontSize: 14 }}>−</button>
                      <span style={{ fontSize: 11, fontWeight: 900 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#FFF', fontWeight: 900, cursor: 'pointer', fontSize: 14 }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- SECTION 2: DELIVERY TYPE --- */}
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Delivery Protocol</label>
                <div onClick={() => setIsScheduling(false)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: isScheduling ? '1px solid rgba(255,255,255,0.05)' : '1px solid #00E67644', marginBottom: 12, transition: '0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: isScheduling ? 'rgba(255,255,255,0.4)' : '#00E676' }}>Normal Delivery</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Delivery in 30-45 minutes</div>
                    </div>
                    {!isScheduling && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00E676' }} />}
                  </div>
                </div>

                <button 
                  onClick={() => setIsScheduling(!isScheduling)} 
                  style={{ width: '100%', padding: '20px', borderRadius: 16, background: isScheduling ? 'rgba(252,128,25,0.1)' : 'rgba(255,255,255,0.02)', border: isScheduling ? '1px solid #FC8019' : '1px solid rgba(255,255,255,0.1)', color: isScheduling ? '#FC8019' : '#FFF', textAlign: 'left', cursor: 'pointer', transition: '0.3s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>Enable Smart Recurring Schedule</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Fully Autonomous Subscription Model</div>
                    </div>
                    <div style={{ fontSize: 18, transform: isScheduling ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</div>
                  </div>
                </button>

                {isScheduling && (
                  <div style={{ background: 'rgba(252,128,25,0.03)', border: '1px solid rgba(252,128,25,0.2)', borderTop: 'none', padding: 24, borderRadius: '0 0 16px 16px', animation: 'fadeIn 0.3s' }}>
                    
                    <div style={{ marginBottom: 24 }}>
                      <label style={labelStyle}>Automation Logic Override</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setSchedule({...schedule, automationPreference: 'AUTO_EXECUTE'})} style={{ ...toggleBtnStyle(schedule.automationPreference === 'AUTO_EXECUTE'), flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 900 }}>AUTO EXECUTE</div>
                          <div style={{ fontSize: 8, opacity: 0.5 }}>Bypass Manual Gates</div>
                        </button>
                        <button onClick={() => setSchedule({...schedule, automationPreference: 'AUTO_CANCEL'})} style={{ ...toggleBtnStyle(schedule.automationPreference === 'AUTO_CANCEL'), flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 900 }}>AUTO CANCEL</div>
                          <div style={{ fontSize: 8, opacity: 0.5 }}>Cancel on Failure</div>
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={labelStyle}>Recurrence Schedule</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {['Daily', 'Weekly', 'Monthly'].map(f => (
                          <button key={f} onClick={() => handleFrequencyChange(f)} style={{ ...toggleBtnStyle(schedule.frequency === f), textAlign: 'center' }}>{f.toUpperCase()}</button>
                        ))}
                      </div>
                    </div>

                    {schedule.frequency === 'Monthly' ? (
                      <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Preferred Monthly Date</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                            <button key={date} onClick={() => setSchedule({...schedule, monthDate: date})} style={{ ...smToggleBtnStyle(schedule.monthDate === date), height: 28 }}>{date}</button>
                          ))}
                        </div>
                      </div>
                    ) : schedule.frequency === 'Weekly' ? (
                      <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Target Weeks</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                          {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'All'].map(w => (
                            <button key={w} onClick={() => toggleWeek(w === 'All' ? 'All Weeks' : w)} style={smToggleBtnStyle(schedule.selectedWeeks.includes(w === 'All' ? 'All Weeks' : w))}>{w.toUpperCase()}</button>
                          ))}
                        </div>
                        <label style={labelStyle}>Target Days</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <button key={d} onClick={() => toggleDay(d)} style={smToggleBtnStyle(schedule.days.includes(d))}>{d.toUpperCase()}</button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Active Day Cycle</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <button key={d} onClick={() => toggleDay(d)} style={smToggleBtnStyle(schedule.days.includes(d))}>{d.toUpperCase()}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={labelStyle}>Delivery Time</label>
                        <input type="time" value={schedule.time} onChange={e => setSchedule({...schedule, time: e.target.value})} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Start Date</label>
                        <input type="date" value={schedule.startDate} onChange={e => setSchedule({...schedule, startDate: e.target.value})} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* --- CLEAN CLASSIC PAYMENT METHODS --- */}
              <div style={{ marginBottom: 40 }}>
                <label style={labelStyle}>Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'UPI', name: 'Google Pay', sub: 'Instant UPI Transfer' },
                    { id: 'CARD', name: 'Credit Card', sub: 'Secured Gateway' },
                    { id: 'NET', name: 'Net Banking', sub: 'All Major Banks' },
                    { id: 'Cash on Delivery', name: 'Cash', sub: 'Pay on Delivery' }
                  ].map(m => (
                    <button key={m.id} onClick={() => setSchedule({...schedule, paymentMethod: m.id})} style={{ ...toggleBtnStyle(schedule.paymentMethod === m.id), padding: '16px', display: 'flex', flexDirection: 'column', gap: 2, border: schedule.paymentMethod === m.id ? '1px solid #FC8019' : '1px solid rgba(255,255,255,0.08)', background: schedule.paymentMethod === m.id ? 'rgba(252,128,25,0.1)' : 'rgba(255,255,255,0.02)' }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: schedule.paymentMethod === m.id ? '#FC8019' : '#FFF' }}>{m.name.toUpperCase()}</div>
                      <div style={{ fontSize: 8, opacity: 0.4, fontWeight: 700 }}>{m.sub.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button onClick={handleInitialize} style={{ width: '100%', padding: '20px', borderRadius: 16, background: '#FC8019', color: '#FFF', border: 'none', fontWeight: 900, fontSize: 13, cursor: 'pointer', letterSpacing: '0.1em', boxShadow: '0 10px 30px rgba(252,128,25,0.3)' }}>
                  {isScheduling ? 'START AUTONOMOUS CYCLE' : 'PLACE ONE-TIME ORDER'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SUCCESS OVERLAY --- */}
        {showSuccess && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <span style={{ fontSize: 40 }}>✓</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Order Placed Successfully</h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Standard delivery protocol initiated. Redirecting...</p>
            </div>
          </div>
        )}

        {/* --- POPUPS: SYSTEM INTERRUPTS --- */}
        {showPopup && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#080808', width: 440, padding: 50, borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#FC8019', marginBottom: 24, letterSpacing: '0.2em' }}>SYSTEM INTERRUPT REQUIRED</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>{showPopup === 'NO_SUB_NOTIF' ? 'Substitute Not Found' : showPopup === 'T30_NOTIF' ? 'T-30 Final Call' : showPopup === 'T60_NOTIF' ? 'T-60 Confirmation' : showPopup.replace('_NOTIF', '').replace('_', ' ')}</h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 40, lineHeight: 1.6, fontSize: 14 }}>
                {showPopup === 'NO_SUB_NOTIF' 
                  ? 'No viable substitutes discovered in local inventory. System requires authorization to proceed with partial delivery or abort.' 
                  : showPopup === 'T30_NOTIF'
                  ? 'The T-60 window has expired. This is the FINAL automated reminder before the system applies your pre-configured preference.'
                  : `Protocol requires manual intervention. Transaction via ${schedule.paymentMethod} encountered a logic branch.`}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                {(showPopup === 'T60_NOTIF' || showPopup === 'T30_NOTIF') && (
                  <>
                    <button onClick={() => inject('injectedT60Response', 'CONFIRM')} style={modalBtnStyle}>CONFIRM EXECUTION</button>
                    <button onClick={() => inject('injectedT60Response', 'CANCEL')} style={{ ...modalBtnStyle, background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>ABORT CYCLE</button>
                    <button onClick={handleNoResponse} style={{ ...modalBtnStyle, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>NO RESPONSE (SIMULATE INACTIVITY)</button>
                  </>
                )}
                {showPopup === 'SUB_NOTIF' && (
                  <>
                    <button onClick={() => inject('injectedUserDecision', 'SUB')} style={modalBtnStyle}>AUTHORIZE SUBSTITUTE</button>
                    <button onClick={() => inject('injectedUserDecision', 'WITHOUT')} style={{ ...modalBtnStyle, background: 'rgba(255,255,255,0.03)' }}>PROCEED WITHOUT ITEM</button>
                    <button onClick={handleNoResponse} style={{ ...modalBtnStyle, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }}>NO RESPONSE</button>
                  </>
                )}
                {showPopup === 'NO_SUB_NOTIF' && (
                  <>
                    <button onClick={() => inject('injectedUserDecision', 'WITHOUT')} style={modalBtnStyle}>CONTINUE WITHOUT ITEM</button>
                    <button onClick={() => inject('injectedUserDecision', 'CANCEL')} style={{ ...modalBtnStyle, background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>CANCEL SCHEDULE</button>
                    <button onClick={handleNoResponse} style={{ ...modalBtnStyle, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }}>NO RESPONSE</button>
                  </>
                )}
                {showPopup === 'PAY_NOTIF' && <button onClick={() => inject('injectedPayment', 'primary_ok')} style={modalBtnStyle}>AUTHORIZE {schedule.paymentMethod.toUpperCase()}</button>}
              </div>
            </div>
          </div>
        )}

        {/* --- CONFIRMATION OVERLAY --- */}
        {showConfirmation && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.98)', backdropFilter: 'blur(30px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#0A0A0A', width: 500, padding: 60, borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#FC8019', marginBottom: 32, letterSpacing: '0.3em' }}>PAYMENT AUTHORIZATION REQUIRED</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>Confirm Automation Schedule</h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 48, lineHeight: 1.8, fontSize: 14 }}>
                Authorizing an automated cycle for <span style={{ color: '#FFF', fontWeight: 800 }}>{cartTotalItems} units</span> using <span style={{ color: '#FC8019', fontWeight: 800 }}>{schedule.paymentMethod.toUpperCase()}</span>. 
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <button onClick={startSimulation} style={{ ...modalBtnStyle, padding: '22px', fontSize: 12 }}>CONFIRM & AUTHORIZE PAYMENTS</button>
                <button onClick={() => setShowConfirmation(false)} style={{ ...modalBtnStyle, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>CANCEL INITIALIZATION</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;700;900&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); borderRadius: 10px; }
      `}</style>
    </div>
  );
}

function ControlBox({ label, onYes, onNo, active, yesLabel="YES", noLabel="NO" }: any) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', padding: '20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)', opacity: active ? 1 : 0.25, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 110 }}>
      <div style={{ fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.25)', marginBottom: 8, letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button disabled={!active} onClick={onYes} style={smBtnStyle(active)}>{yesLabel}</button>
        <button disabled={!active} onClick={onNo} style={{ ...smBtnStyle(active), color: '#FF3B30' }}>{noLabel}</button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' as const };
const inputStyle = { width: '100%', padding: '12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' };
const toggleBtnStyle = (active: boolean, fullWidth = false) => ({ width: fullWidth ? '100%' : 'auto', padding: '12px', borderRadius: 8, background: active ? '#FC8019' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF', fontWeight: 900, fontSize: 10, cursor: 'pointer', textAlign: 'left' as const });
const smToggleBtnStyle = (active: boolean) => ({ padding: '8px 12px', borderRadius: 6, background: active ? '#FC8019' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#FFF', fontSize: 9, fontWeight: 900, cursor: 'pointer' });
const smBtnStyle = (active: boolean) => ({ flex: 1, padding: '10px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#FFF', fontSize: 9, fontWeight: 900, cursor: active ? 'pointer' : 'default', letterSpacing: '0.05em' });
const modalBtnStyle = { width: '100%', padding: '18px', borderRadius: 10, background: '#FC8019', border: 'none', color: '#FFF', fontSize: 10, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' };
