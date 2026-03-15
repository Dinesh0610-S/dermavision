import sys
import os

# Mock the environment or logic if needed, but here we just test the math directly
def calculate_healing(day1_conf, current_conf, day1_disease, current_disease, day1_normal, current_normal):
    if abs(day1_conf - current_conf) < 0.0001 and day1_disease == current_disease:
        return 0, "Identical"
    
    if day1_disease == current_disease:
        conf_drop = day1_conf - current_conf
        normal_gain = current_normal - day1_normal
        if conf_drop > 0:
            progression = conf_drop / day1_conf
            healing_percentage = int(progression * 100)
        elif normal_gain > 5:
            healing_percentage = int(min(40, normal_gain * 2))
        else:
            healing_percentage = 0
    elif current_disease == "Normal Skin":
        healing_percentage = max(90, int(current_conf))
    else:
        if current_conf < day1_conf:
            healing_percentage = int((day1_conf - current_conf) / 2)
        else:
            healing_percentage = 0
            
    return max(0, min(100, healing_percentage))

# Test Cases
tests = [
    (90, 45, "Acne", "Acne", 2, 10, 50), # 50% improvement
    (80, 80, "Acne", "Acne", 5, 5, 0),   # Identical
    (95, 96, "Acne", "Acne", 2, 2, 0),   # Worsening confidence
    (30, 95, "Acne", "Normal Skin", 5, 95, 95), # Cured
    (90, 85, "Acne", "Acne", 2, 12, 5),  # Slight drop in disease, gain in normal
]

for d1c, cc, d1d, cd, d1n, cn, expected in tests:
    res = calculate_healing(d1c, cc, d1d, cd, d1n, cn)
    print(f"D1:{d1c}% {d1d} -> Curr:{cc}% {cd} | Result: {res}% (Expected: {expected}%)")
