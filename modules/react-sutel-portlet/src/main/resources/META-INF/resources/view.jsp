
<%@ include file="/init.jsp" %>

<div id="<portlet:namespace />-react-sutel-root"></div>

<script>
    window.LIFERAY_PORTLET_NAMESPACE = '<portlet:namespace />';
    window.LIFERAY_CURRENT_URL = '<%= themeDisplay.getURLCurrent() %>';
    window.LIFERAY_USER_ID = '<%= themeDisplay.getUserId() %>';
</script>

<script src="<%= request.getContextPath() %>/js/react-sutel-bundle.js"></script>
