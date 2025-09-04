@@ .. @@
   const fetchLeaderboard = async () => {
     try {
+      // Get start and end of today in local timezone
+      const today = new Date();
+      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
+      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
+
       const { data, error } = await supabase
         .from('game_sessions')
         .select('*')
+        .gte('created_at', startOfDay.toISOString())
+        .lt('created_at', endOfDay.toISOString())
         .order('score', { ascending: false })
         .limit(10);
 
@@ .. @@
                   <div className="text-sm text-gray-600">
                     {t('leaderboard.score')}: {session.score} DKK
                   </div>
                   <div className="text-xs text-gray-500">
-                    {new Date(session.created_at).toLocaleDateString()}
+                    {new Date(session.created_at).toLocaleString('da-DK', {
+                      hour: '2-digit',
+                      minute: '2-digit',
+                      day: '2-digit',
+                      month: '2-digit',
+                      year: 'numeric'
+                    })}
                   </div>
                 </div>