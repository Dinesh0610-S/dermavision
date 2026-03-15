import hashlib

def calculate_healing_v3(day1_conf, current_conf, day1_disease, current_disease, is_identical):
    if is_identical:
        return 0, "Identical scans detected. No change in healing velocity."
    
    if day1_disease == current_disease:
        conf_delta = day1_conf - current_conf
        if conf_delta > 0:
            healing_percentage = int(conf_delta)
        else:
            healing_percentage = 0
    elif current_disease == "Normal Skin":
        healing_percentage = 100
    else:
        if current_conf < day1_conf:
            healing_percentage = int(day1_conf - current_conf)
        else:
            healing_percentage = 0
            
    healing_percentage = max(0, min(100, healing_percentage))
    
    if healing_percentage > 50:
        note = "Rapid progress!"
    elif healing_percentage > 0:
        note = "Steady healing detected."
    else:
        note = "Stable."
        
    return healing_percentage, note

# Test Cases
tests = [
    (90, 45, "Acne", "Acne", False, 45), # Not identical, 45% progress
    (80, 80, "Acne", "Acne", True, 0),    # Identical!
    (80, 80, "Acne", "Acne", False, 0),   # Same confidence but DIFFERENT images (e.g. slight change) -> 0% is correct if conf didn't drop
    (90, 80, "Acne", "Acne", False, 10),  # Not identical, drop detected
]

for d1c, cc, d1d, cd, identical, expected in tests:
    res, note = calculate_healing_v3(d1c, cc, d1d, cd, identical)
    print(f"D1:{d1c}% {d1d} -> Curr:{cc}% {cd} | ID:{identical} | Result: {res}% (Expected: {expected}%)")
