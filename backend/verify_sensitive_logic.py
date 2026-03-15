def calculate_sensitive_healing(day1_conf, day1_normal, current_probs, current_normal, day1_disease, current_disease, is_identical):
    if is_identical:
        return 0, "Identical scans detected."
    
    # 1. Track the fall of the Baseline Disease
    d1_disease_now_conf = current_probs.get(day1_disease, 0)
    disease_drop = day1_conf - d1_disease_now_conf
    
    # 2. Track the rise of Healthy Skin
    normal_rise = current_normal - day1_normal
    
    # 3. Comprehensive Velocity Calculation
    velocity = (disease_drop * 0.7) + (max(0, normal_rise) * 0.3)
    
    # Special case: If it's now predicted as Normal Skin with high confidence
    if current_disease == "Normal Skin" and current_probs.get("Normal Skin", 0) > 70:
        velocity = max(velocity, current_probs.get("Normal Skin", 0))
        
    healing_percentage = int(max(0, min(100, velocity)))
    return healing_percentage

# Test Cases
tests = [
    # Baseline 90% Acne, 5% Normal
    # Current 45% Acne, 30% Normal -> Significant drop + rise
    (90, 5, {"Acne": 45, "Normal Skin": 30}, 30, "Acne", "Acne", False, 39), # (45*0.7) + (25*0.3) = 31.5 + 7.5 = 39
    
    # Baseline 90% Acne
    # Current 10% Acne, 85% Normal Skin -> Extreme clearing
    (90, 5, {"Acne": 10, "Normal Skin": 85}, 85, "Acne", "Normal Skin", False, 85), # Max(velocity, 85) = 85
    
    # Baseline 90% Acne
    # Current 95% Acne -> Worsening/Stalled
    (90, 5, {"Acne": 95, "Normal Skin": 2}, 2, "Acne", "Acne", False, 0),
]

for d1c, d1n, cur_probs, cur_n, d1d, curd, ident, expected in tests:
    res = calculate_sensitive_healing(d1c, d1n, cur_probs, cur_n, d1d, curd, ident)
    print(f"D1 {d1d}:{d1c}% -> Curr {curd}: Result {res}% (Expected: ~{expected}%)")
