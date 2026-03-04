#!/bin/bash

echo "🔍 Checking DNS propagation for narayanaconsultingservicesllp.co.in"
echo "======================================================================"
echo ""

echo "📍 Checking A Records (Root Domain)..."
A_RECORDS=$(dig narayanaconsultingservicesllp.co.in +short)

if [ -z "$A_RECORDS" ]; then
    echo "❌ No A records found yet"
    echo "   Status: DNS not propagated"
else
    echo "✅ A Records found:"
    echo "$A_RECORDS"
    
    # Check if all 4 GitHub IPs are present
    EXPECTED_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")
    ALL_PRESENT=true
    
    for ip in "${EXPECTED_IPS[@]}"; do
        if echo "$A_RECORDS" | grep -q "$ip"; then
            echo "   ✓ $ip"
        else
            echo "   ✗ $ip (missing)"
            ALL_PRESENT=false
        fi
    done
    
    if [ "$ALL_PRESENT" = true ]; then
        echo "   Status: All A records correct! ✅"
    else
        echo "   Status: Some A records missing ⚠️"
    fi
fi

echo ""
echo "📍 Checking CNAME Record (www subdomain)..."
CNAME_RECORD=$(dig www.narayanaconsultingservicesllp.co.in CNAME +short)

if [ -z "$CNAME_RECORD" ]; then
    echo "❌ No CNAME record found yet"
    echo "   Status: DNS not propagated"
else
    echo "✅ CNAME Record found:"
    echo "   $CNAME_RECORD"
    
    if echo "$CNAME_RECORD" | grep -q "narayanaconsultingservicesllp.github.io"; then
        echo "   Status: CNAME correct! ✅"
    else
        echo "   Status: CNAME incorrect ⚠️"
        echo "   Expected: narayanaconsultingservicesllp.github.io"
    fi
fi

echo ""
echo "======================================================================"
echo "📊 Summary:"
echo ""

if [ -n "$A_RECORDS" ] && [ -n "$CNAME_RECORD" ]; then
    echo "🎉 DNS is propagated! Your domain should work soon."
    echo ""
    echo "Next steps:"
    echo "1. Go to GitHub Settings → Pages"
    echo "2. The error should disappear"
    echo "3. Enable 'Enforce HTTPS'"
    echo "4. Visit http://narayanaconsultingservicesllp.co.in"
elif [ -n "$A_RECORDS" ] || [ -n "$CNAME_RECORD" ]; then
    echo "⏳ DNS is partially propagated. Keep waiting..."
    echo ""
    echo "Run this script again in 15-30 minutes."
else
    echo "⏳ DNS not propagated yet. This is normal!"
    echo ""
    echo "What to do:"
    echo "1. Make sure you clicked 'Save' in your DNS panel"
    echo "2. Wait 15-30 minutes"
    echo "3. Run this script again: ./check-dns.sh"
    echo ""
    echo "DNS propagation can take up to 48 hours."
fi

echo ""
echo "💡 Tip: You can also check at https://dnschecker.org"
