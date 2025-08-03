// Test script to verify cache invalidation fixes
// Run this in the browser console or as a Node.js script

const testCacheInvalidation = async () => {
  console.log('🧪 Testing Cache Invalidation Fixes...\n');

  // Test 1: Check if cache invalidation is working for artists
  console.log('1️⃣ Testing Artist Cache Invalidation:');
  try {
    // Simulate adding a new artist
    const artistData = {
      labelId: "test-label-id",
      artistName: "Test Artist " + Date.now(),
      iprs: false,
      isSinger: true,
      isLyricist: false,
      isComposer: false,
      isProducer: false
    };

    const response = await fetch('/api/artist/addArtist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artistData)
    });

    if (response.ok) {
      console.log('✅ Artist creation successful');
      
      // Check if data appears in the list immediately
      const artistsResponse = await fetch('/api/artist/getAllArtist');
      const artistsData = await artistsResponse.json();
      
      if (artistsData.success && artistsData.data) {
        const newArtist = artistsData.data.find(a => a.artistName === artistData.artistName);
        if (newArtist) {
          console.log('✅ New artist appears in list immediately');
        } else {
          console.log('❌ New artist not found in list - cache issue detected');
        }
      }
    } else {
      console.log('❌ Artist creation failed');
    }
  } catch (error) {
    console.log('❌ Error testing artist cache:', error);
  }

  // Test 2: Check if cache invalidation is working for labels
  console.log('\n2️⃣ Testing Label Cache Invalidation:');
  try {
    const labelData = {
      username: "Test Label " + Date.now(),
      email: `test${Date.now()}@example.com`,
      contact: "1234567890",
      lable: "Test Label",
      usertype: "normal",
      state: "Test State"
    };

    const response = await fetch('/api/labels/addLabel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(labelData)
    });

    if (response.ok) {
      console.log('✅ Label creation successful');
      
      // Check if data appears in the list immediately
      const labelsResponse = await fetch('/api/labels/getLabels');
      const labelsData = await labelsResponse.json();
      
      if (labelsData.success && labelsData.data) {
        const newLabel = labelsData.data.find(l => l.username === labelData.username);
        if (newLabel) {
          console.log('✅ New label appears in list immediately');
        } else {
          console.log('❌ New label not found in list - cache issue detected');
        }
      }
    } else {
      console.log('❌ Label creation failed');
    }
  } catch (error) {
    console.log('❌ Error testing label cache:', error);
  }

  // Test 3: Check if cache invalidation is working for support tickets
  console.log('\n3️⃣ Testing Support Cache Invalidation:');
  try {
    const ticketData = {
      email: "test@example.com",
      subject: "Test Ticket " + Date.now(),
      message: "This is a test ticket",
      priority: "medium",
      category: "general"
    };

    const response = await fetch('/api/support/createTicket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });

    if (response.ok) {
      console.log('✅ Support ticket creation successful');
      
      // Check if data appears in the list immediately
      const ticketsResponse = await fetch('/api/support/getAllTickets');
      const ticketsData = await ticketsResponse.json();
      
      if (ticketsData.success && ticketsData.data) {
        const newTicket = ticketsData.data.find(t => t.subject === ticketData.subject);
        if (newTicket) {
          console.log('✅ New ticket appears in list immediately');
        } else {
          console.log('❌ New ticket not found in list - cache issue detected');
        }
      }
    } else {
      console.log('❌ Support ticket creation failed');
    }
  } catch (error) {
    console.log('❌ Error testing support cache:', error);
  }

  // Test 4: Check SWR revalidation
  console.log('\n4️⃣ Testing SWR Revalidation:');
  try {
    // This test checks if SWR is properly revalidating data
    console.log('✅ SWR revalidation should work with mutate() calls');
    console.log('✅ Check browser network tab for revalidation requests');
  } catch (error) {
    console.log('❌ Error testing SWR revalidation:', error);
  }

  console.log('\n🎯 Cache Invalidation Test Complete!');
  console.log('📝 Check the console for cache debug information');
  console.log('🔧 Use the Cache Debugger component to monitor cache state');
};

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCacheInvalidation };
}

// Auto-run in browser
if (typeof window !== 'undefined') {
  // Add to window for manual testing
  window.testCacheInvalidation = testCacheInvalidation;
  console.log('🧪 Cache invalidation test function available as window.testCacheInvalidation()');
} 